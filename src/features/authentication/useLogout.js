// 导入React Query核心Hook：useMutation处理修改类请求、useQueryClient操作缓存
import { useMutation, useQueryClient } from "@tanstack/react-query";
// 导入退出登录接口：封装后端退出登录的API请求逻辑
import { logout as logoutApi } from "../../services/apiAuth";
// 导入路由导航Hook：实现退出成功后的页面重定向
import { useNavigate } from "react-router-dom";

// 自定义Hook：封装退出登录的业务逻辑，对外暴露执行方法和加载状态
export function useLogout() {
  // 获取路由导航实例，用于页面跳转
  const navigate = useNavigate();
  // 获取React Query客户端实例，用于操作缓存
  const queryClient = useQueryClient();

  // 初始化mutation：处理退出登录的异步请求，管理请求状态
  const { mutate: logout, isLoading } = useMutation({
    mutationFn: logoutApi, // 执行退出登录的API请求函数
    onSuccess: () => { // 请求成功后的回调逻辑
      queryClient.removeQueries(); // 清除所有缓存数据，防止未登录状态访问缓存信息
      navigate("/login", { replace: true }); // 重定向到登录页，replace:true避免回退到原受保护页面
    },
  });

  // 对外暴露：退出登录执行方法、请求加载状态
  return { logout, isLoading };
}