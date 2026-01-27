// 导入React Query的核心钩子：useMutation处理登录这类异步修改操作，useQueryClient用于操作缓存数据
import { useMutation, useQueryClient } from '@tanstack/react-query';
// 导入底层登录API接口：封装了Supabase的邮箱密码登录逻辑，统一的接口服务层
import { login as loginApi } from '../../services/apiAuth';
// 导入react-router-dom的导航钩子：实现登录成功后的页面跳转功能
import { useNavigate } from 'react-router-dom';
// 导入全局提示工具：用于给用户展示登录成功/失败的友好提示
import { toast } from 'react-hot-toast';

// 封装登录业务逻辑的自定义Hook，供登录表单组件调用
export function useLogin() {
  // 获取React Query缓存客户端：用于登录成功后更新全局用户信息缓存
  const queryClient = useQueryClient();
  // 获取路由导航实例：用于登录成功后跳转到仪表盘页面
  const navigate = useNavigate();

  // 使用useMutation处理登录异步请求（非查询类操作适用），解构出执行请求的mutate（重命名为login）和请求加载状态isLoading
  const { mutate: login, isLoading } = useMutation({
    // 核心异步请求函数：接收表单传入的邮箱和密码，调用底层登录API完成身份验证
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    // 登录请求成功后的回调函数：参数为loginApi返回的用户数据
    onSuccess: (user) => {
      // 将登录成功的用户信息存入React Query缓存，key为['user']，供其他组件快速获取
      queryClient.setQueryData(['user'], user.user);
      // 跳转到仪表盘页面，replace: true替换当前路由历史，避免回退时重新进入登录页
      navigate('/dashboard', { replace: true });
    },
    // 登录请求失败后的回调函数：参数为抛出的错误对象
    onError: (err) => {
      // 控制台打印错误信息，方便开发调试
      console.log('ERROR', err);
      // 全局弹出错误提示，告知用户邮箱或密码输入错误
      toast.error('Provided email or password are incorrect');
    },
  });

  // 对外暴露登录执行方法和加载状态，供登录表单组件使用
  return { login, isLoading };
}