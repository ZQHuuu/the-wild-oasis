// 导入样式组件库，用来写组件专属的CSS样式
import styled from "styled-components";
// 导入自定义的用户状态钩子，专门获取用户是否登录、是否在加载的状态
import { useUser } from "../features/authentication/useUser";
// 导入加载动画组件，数据/状态加载时显示转圈效果
import Spinner from "./Spinner";
// 导入路由导航钩子，用来实现代码里跳转到其他页面（比如未登录跳登录页）
import { useNavigate } from "react-router-dom";
// 导入React的副作用钩子，用来监听状态变化并执行跳转逻辑
import { useEffect } from "react";

// 定义一个全屏的样式容器，用来让加载动画在页面正中间显示
const FullPage = styled.div`
  height: 100vh; /* 占满整个浏览器视口高度 */
  background-color: var(--color-grey-50); /* 浅灰色背景，项目全局样式变量 */
  display: flex; /* 弹性布局，用来居中 */
  align-items: center; /* 垂直方向居中 */
  justify-content: center; /* 水平方向居中 */
`;

// 受保护路由组件：只有登录的用户才能看到这个组件包裹的内容，未登录则跳登录页
function ProtectedRoute({ children }) {
  // 创建导航实例，后续用navigate()就能跳转到指定页面
  const navigate = useNavigate();

  // 从useUser钩子中获取两个关键状态：isLoading(状态是否在加载)、isAuthenticated(用户是否已登录)
  const { isLoading, isAuthenticated } = useUser();

  // 监听用户登录状态，一旦确认未登录，就跳转到登录页
  useEffect(
    function () {
      // 条件：用户未登录 且 状态加载完成（排除加载中的情况，避免误跳转）
      if (!isAuthenticated && !isLoading) navigate("/login");
    },
    [isAuthenticated, isLoading, navigate] // 依赖的状态，任一变化就重新执行这个函数
  );

  // 如果用户状态还在加载中（比如验证登录信息），就全屏显示加载动画
  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  // 如果用户已登录，就渲染组件包裹的内容（比如首页、管理页这些需要登录的页面）
  if (isAuthenticated) return children;
}

// 导出这个受保护路由组件，供路由配置文件使用
export default ProtectedRoute;