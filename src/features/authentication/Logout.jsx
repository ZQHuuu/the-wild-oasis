// 导入退出登录图标
import { HiArrowRightOnRectangle } from "react-icons/hi2";
// 导入通用图标按钮组件
import ButtonIcon from "../../ui/ButtonIcon";
// 导入退出登录自定义Hook
import { useLogout } from "./useLogout";
// 导入按钮内迷你加载动画
import SpinnerMini from "../../ui/SpinnerMini";

// 退出登录图标按钮组件
function Logout() {
  // 获取退出登录方法和加载状态
  const { logout, isLoading } = useLogout();

  return (
    // 图标按钮：加载中禁用，点击触发退出
    <ButtonIcon disabled={isLoading} onClick={logout}>
      {/* 条件渲染：未加载显图标，加载中显迷你加载 */}
      {!isLoading ? <HiArrowRightOnRectangle /> : <SpinnerMini />}
    </ButtonIcon>
  );
}

export default Logout;