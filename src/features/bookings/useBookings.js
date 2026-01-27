// 导入React Query核心Hook：useQuery用于发起数据请求、useQueryClient用于预取数据等缓存操作
import { useQuery, useQueryClient } from "@tanstack/react-query";
// 导入预订数据请求接口：封装了向Supabase获取预订数据的后端请求逻辑
import { getBookings } from "../../services/apiBookings";
// 导入路由查询参数Hook：获取URL中的searchParams，存储筛选、排序、分页规则，实现状态持久化
import { useSearchParams } from "react-router-dom";
// 导入分页常量：全局统一的每页展示数据条数，避免硬编码
import { PAGE_SIZE } from "../../utils/constants";

/**
 * 预订数据专属自定义Hook
 * 核心作用：封装预订数据的「筛选、排序、分页、请求、预取」全逻辑，提供标准化的预订数据状态
 * 对外暴露：加载状态、错误信息、预订数据列表、数据总条数，供上层组件直接使用
 */
export function useBookings() {
  // 获取React Query的客户端实例，用于后续预取数据（prefetchQuery）
  const queryClient = useQueryClient();
  // 从路由中获取查询参数（仅读取，不修改），筛选/排序/分页规则都存在URL中
  const [searchParams] = useSearchParams();

  // -------------------------- 1. 筛选逻辑处理：基于status字段筛选预订状态 --------------------------
  // 从URL中获取筛选值（预订状态：checked-out/checked-in/unconfirmed/all）
  const filterValue = searchParams.get("status");
  // 格式化筛选参数：适配apiBookings的接口入参规范
  // 无筛选值/值为all → 传null（表示不筛选）；否则传{字段, 值}的对象格式
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };
  // 示例扩展筛选格式（接口支持多条件/多方法筛选，如总价大于等于5000）
  // { field: "totalPrice", value: 5000, method: "gte" };

  // -------------------------- 2. 排序逻辑处理：支持startDate/totalPrice的正/倒序 --------------------------
  // 从URL中获取排序规则，无则默认按入住日期降序（最新的预订在前）
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  // 拆分排序规则：按「-」分割为「排序字段」和「排序方向」（如startDate-desc → [startDate, desc]）
  const [field, direction] = sortByRaw.split("-");
  // 格式化排序参数：适配apiBookings的接口入参规范，转为对象格式
  const sortBy = { field, direction };

  // -------------------------- 3. 分页逻辑处理：基于页码实现数据分屏展示 --------------------------
  // 从URL中获取页码，无则默认第1页；URL中取到的是字符串，需转为数字类型
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  // -------------------------- 4. 核心数据请求：基于React Query发起带筛选/排序/分页的请求 --------------------------
  const {
    isLoading, // 请求加载状态：true表示数据正在请求，false表示请求完成
    data: { data: bookings, count } = {}, // 解构请求结果：data是预订数据列表，count是数据总条数；默认空对象避免解构报错
    error, // 请求错误信息：请求失败时返回错误对象，成功时为undefined
  } = useQuery({
    // React Query的查询键：唯一标识该请求，用于缓存、预取、失效等操作
    // 依赖项：筛选、排序、页码，任一变化会触发重新请求数据
    queryKey: ["bookings", filter, sortBy, page],
    // 查询函数：发起实际的后端请求，将格式化后的筛选/排序/分页参数传给接口
    queryFn: () => getBookings({ filter, sortBy, page }),
  });

  // -------------------------- 5. 数据预取：提升分页体验，提前加载下一页/上一页数据 --------------------------
  // 计算总页数：总条数 ÷ 每页条数，向上取整（如总25条，每页10条 → 3页）
  const pageCount = Math.ceil(count / PAGE_SIZE);

  // 预取下一页数据：当前页小于总页数时，提前请求下一页，用户翻页时无加载等待
  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page + 1], // 下一页的查询键（页码+1）
      queryFn: () => getBookings({ filter, sortBy, page: page + 1 }), // 预取下一页数据
    });

  // 预取上一页数据：当前页大于1时，提前请求上一页，用户回退页码时无加载等待
  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page - 1], // 上一页的查询键（页码-1）
      queryFn: () => getBookings({ filter, sortBy, page: page - 1 }), // 预取上一页数据
    });

  // 对外暴露核心状态：上层组件（如BookingTable）直接解构使用，无需关心内部逻辑
  return { isLoading, error, bookings, count };
}