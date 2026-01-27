// 导入已配置好的supabase实例（含项目地址、公钥/私钥等配置）、supabase文件存储的基础URL
import supabase, { supabaseUrl } from "./supabase";

/**
 * 用户注册接口
 * @param {Object} params - 注册参数
 * @param {string} params.fullName - 用户全名
 * @param {string} params.email - 用户注册邮箱（作为登录账号）
 * @param {string} params.password - 用户注册密码
 * @returns {Promise<Object>} Supabase返回的注册用户数据
 * @throws {Error} 注册失败时抛出错误信息
 */
export async function signup({ fullName, email, password }) {
  // 调用Supabase Auth的注册方法，传入邮箱、密码，并附加用户自定义数据（全名、头像初始为空）
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName, // 自定义用户数据：全名
        avatar: "", // 自定义用户数据：头像URL，初始为空字符串
      },
    },
  });

  // 注册失败时，抛出包含具体错误信息的Error对象，供上层调用者捕获
  if (error) throw new Error(error.message);

  // 注册成功，返回Supabase返回的用户数据（含用户信息、会话信息等）
  return data;
}

/**
 * 用户登录接口（邮箱+密码方式）
 * @param {Object} params - 登录参数
 * @param {string} params.email - 用户登录邮箱
 * @param {string} params.password - 用户登录密码
 * @returns {Promise<Object>} Supabase返回的登录数据（含用户信息、会话token等）
 * @throws {Error} 登录失败时抛出错误信息（如邮箱不存在、密码错误）
 */
export async function login({ email, password }) {
  // 调用Supabase Auth的密码登录方法，传入邮箱和密码进行身份验证
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // 登录失败时，抛出具体错误信息
  if (error) throw new Error(error.message);

  // 登录成功，返回登录数据（含用户信息、会话信息，用于维护前端登录状态）
  return data;
}

/**
 * 获取当前登录用户信息
 * 核心：先验证会话是否有效，再获取用户详情，避免无效的用户信息获取
 * @returns {Promise<Object|null>} 登录用户信息对象，未登录/会话失效则返回null
 * @throws {Error} 获取用户信息失败时抛出错误信息
 */
export async function getCurrentUser() {
  // 第一步：获取当前Supabase的会话信息（会话是用户登录状态的核心标识）
  const { data: session } = await supabase.auth.getSession();
  // 无有效会话（未登录/会话过期），直接返回null
  if (!session.session) return null;

  // 第二步：会话有效时，获取当前登录的用户详情
  const { data, error } = await supabase.auth.getUser();

  // 获取用户信息失败，抛出错误
  if (error) throw new Error(error.message);
  // 成功返回用户信息，使用可选链避免data为undefined时的报错
  return data?.user;
}

/**
 * 用户退出登录接口
 * 核心：清除前端会话信息，让Supabase的Auth状态变为未登录
 * @returns {Promise<void>} 无返回值
 * @throws {Error} 退出登录失败时抛出错误信息
 */
export async function logout() {
  // 调用Supabase Auth的退出登录方法，清除当前会话
  const { error } = await supabase.auth.signOut();
  // 退出失败抛出错误
  if (error) throw new Error(error.message);
}

/**
 * 更新当前登录用户信息
 * 支持三种更新场景：仅改密码、仅改全名、仅改头像、改密码+全名、改全名+头像（密码与头像无法同时改）
 * 执行流程：1. 更新密码/全名 → 2. 有头像则上传至Supabase存储 → 3. 更新用户信息中的头像URL
 * @param {Object} params - 更新参数（至少传一个，无则不执行任何操作）
 * @param {string} [params.password] - 新密码（可选）
 * @param {string} [params.fullName] - 新的用户全名（可选）
 * @param {File} [params.avatar] - 头像文件对象（可选，来自前端文件上传组件）
 * @returns {Promise<Object>} 更新后的用户信息
 * @throws {Error} 任意步骤失败均抛出对应错误信息
 */
export async function updateCurrentUser({ password, fullName, avatar }) {
  // 1. 更新密码 或 全名（Supabase要求密码和自定义数据需分开更新，故做判断）
  // 定义更新数据对象，初始为空
  let updateData;
  // 传了密码，则更新数据为密码对象
  if (password) updateData = { password };
  // 传了全名，则更新数据为自定义用户数据（fullName存在于auth的data中）
  if (fullName) updateData = { data: { fullName } };

  // 调用Supabase Auth的更新用户方法，更新密码/全名
  const { data, error } = await supabase.auth.updateUser(updateData);
  // 密码/全名更新失败，抛出错误
  if (error) throw new Error(error.message);
  // 若无头像需要上传，直接返回更新后的用户数据
  if (!avatar) return data;

  // 2. 有头像文件时，上传头像至Supabase的文件存储服务
  // 生成唯一的头像文件名：前缀-用户ID-随机数，避免文件名重复导致覆盖
  const fileName = `avatar-${data.user.id}-${Math.random()}`;

  // 上传头像文件至Supabase存储的「avatars」桶（bucket），传入唯一文件名和文件对象
  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);

  // 头像上传失败，抛出存储相关错误
  if (storageError) throw new Error(storageError.message);

  // 3. 头像上传成功后，更新用户信息中的avatar字段为图片的公共访问URL
  // 拼接Supabase存储的公共访问URL：基础URL + 存储路径 + 唯一文件名
  const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
    data: {
      avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
    },
  });

  // 头像URL更新失败，抛出错误
  if (error2) throw new Error(error2.message);
  // 所有步骤成功，返回最终更新后的用户信息
  return updatedUser;
}