// 1. 导入 React Query 核心钩子：useQuery 用于发起异步数据请求（获取数据）
import { useQuery } from "@tanstack/react-query";
// 2. 导入自定义的 API 服务函数：getCabins 是实际发送请求获取木屋列表的函数（封装了 axios/fetch 逻辑）
import { getCabins } from "../../services/apiCabins";

// 3. 封装自定义 Hook：useCabins（遵循 React Hook 命名规范，以 use 开头）
// 作用：集中管理“获取木屋列表”的所有逻辑（加载状态、数据、错误），方便在组件中复用
export function useCabins() {
  // 4. 调用 useQuery 发起异步查询
  // useQuery 是 React Query 核心，用于处理“只读”的异步数据请求，自动管理加载/成功/失败状态
  const {
    // 5. isLoading：布尔值，请求正在进行时为 true（可用于显示加载中 spinner）
    isLoading,
    // 6. data：请求成功后返回的数据，这里重命名为 cabins（更语义化）
    //    对应 getCabins 函数返回的木屋列表数据
    data: cabins,
    // 7. error：请求失败时的错误对象（包含错误信息、状态码等）
    error,
  } = useQuery({
    // 8. queryKey：【核心】查询的唯一标识（数组格式）
    //    作用1：React Query 基于这个 key 缓存数据，相同 key 不会重复发请求
    //    作用2：key 变化时会自动重新发起请求（比如筛选条件变了，key 加个筛选参数）
    //    这里 ["cabins"] 表示“获取所有木屋”的查询
    queryKey: ["cabins"],
    // 9. queryFn：异步请求函数（必须返回 Promise）
    //    这里传入 getCabins，它内部封装了调用后端 API 的逻辑（比如 fetch('/api/cabins')）
    queryFn: getCabins,
  });

  // 10. 返回状态和数据：让使用这个 Hook 的组件能拿到加载状态、木屋数据、错误信息
  return { isLoading, error, cabins };
}