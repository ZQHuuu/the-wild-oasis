// 导入React内置的useState钩子，用于管理表单的邮箱、密码本地状态
import { useState } from "react";
// 导入通用UI组件：按钮，统一项目按钮样式、尺寸和交互
import Button from "../../ui/Button";
// 导入通用UI组件：表单容器，封装表单基础样式、提交事件基础处理
import Form from "../../ui/Form";
// 导入通用UI组件：输入框，封装输入框基础样式、禁用、类型等属性
import Input from "../../ui/Input";
// 导入通用UI组件：垂直布局表单行，包裹「标签+输入组件」，实现标签在上、输入框在下的垂直布局
import FormRowVertical from "../../ui/FormRowVertical";
// 导入登录专属自定义Hook：封装登录的异步请求逻辑，包含登录方法、请求加载状态
import { useLogin } from "./useLogin";
// 导入通用UI组件：迷你加载动画，用于登录请求中替换按钮文字，提示用户加载状态
import SpinnerMini from "../../ui/SpinnerMini";

/**
 * 登录表单组件
 * 核心功能：收集用户邮箱/密码，触发登录请求，管理请求加载状态，适配密码管理器自动填充，请求完成后重置表单
 * 无外部传参，独立实现登录表单所有交互逻辑
 * @returns {JSX.Element} 渲染后的登录表单
 */
function LoginForm() {
  // 定义邮箱状态：初始值为空字符串，setEmail用于更新邮箱值
  const [email, setEmail] = useState("zhiqing@example.com");
  // 定义密码状态：初始值为空字符串，setPassword用于更新密码值
  const [password, setPassword] = useState("123456");
  // 从登录Hook中解构：登录执行方法、登录请求的加载状态（自动管理异步请求）
  const { login, isLoading } = useLogin();

  /**
   * 表单提交处理函数
   * @param {Event} e - 表单提交原生事件对象
   * 核心逻辑：阻止浏览器默认提交行为 → 简单校验邮箱/密码非空 → 调用登录方法 → 配置请求完成后重置表单
   */
  function handleSubmit(e) {
    // 阻止浏览器原生表单提交行为（避免页面刷新，保持前端异步提交）
    e.preventDefault();
    // 简单前端校验：邮箱或密码为空时，直接返回，不触发登录请求
    if (!email || !password) return;
    // 调用登录Hook的login方法，发起登录异步请求
    login(
      { email, password }, // 传给后端的登录参数：邮箱和密码
      {
        // onSettled：登录请求「无论成功/失败」都会执行的回调（Promise的finally）
        onSettled: () => {
          // 请求完成后，重置邮箱和密码为初始空值，清空表单输入框
          setEmail("");
          setPassword("");
        },
      }
    );
  }

  // 渲染登录表单：基于通用Form组件，绑定自定义提交处理函数
  return (
    <Form onSubmit={handleSubmit}>
      {/* 邮箱输入行：垂直布局，标签为Email address */}
      <FormRowVertical label="Email address">
        <Input
          type="email" // 输入框类型为邮箱，浏览器会做原生邮箱格式校验（如必须包含@）
          id="email" // 唯一标识，与FormRowVertical的label做关联，提升可访问性
          autoComplete="username" // 适配密码管理器，标记为用户名/邮箱，实现自动填充
          value={email} // 绑定邮箱状态，实现「受控组件」（输入框值由React状态管理）
          onChange={(e) => setEmail(e.target.value)} // 输入变化时，更新邮箱状态
          disabled={isLoading} // 登录请求中禁用输入框，防止用户修改数据
        />
      </FormRowVertical>

      {/* 密码输入行：垂直布局，标签为Password */}
      <FormRowVertical label="Password">
        <Input
          type="password" // 输入框类型为密码，输入内容会做掩码处理（圆点/星号）
          id="password" // 唯一标识，与label关联，提升可访问性
          autoComplete="current-password" // 适配密码管理器，标记为当前网站密码，实现自动填充
          value={password} // 绑定密码状态，实现受控组件
          onChange={(e) => setPassword(e.target.value)} // 输入变化时，更新密码状态
          disabled={isLoading} // 登录请求中禁用输入框，防止用户修改数据
        />
      </FormRowVertical>

      {/* 登录按钮行：垂直布局，无标签，仅展示登录按钮 */}
      <FormRowVertical>
        <Button 
          size="large" // 按钮尺寸为大尺寸，突出登录操作
          disabled={isLoading} // 登录请求中禁用按钮，防止重复点击发起多次请求
        >
          {/* 按钮内容动态渲染：未加载时显示“Log in”文字，加载中显示迷你加载动画 */}
          {!isLoading ? "Log in" : <SpinnerMini />}
        </Button>
      </FormRowVertical>
    </Form>
  );
}

// 导出登录表单组件，供登录页面（如LoginPage）导入使用
export default LoginForm;