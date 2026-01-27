// 导入通用排序下拉组件
import SortBy from "../../ui/SortBy";
// 导入通用筛选下拉组件
import Filter from "../../ui/Filter";
// 导入表格操作布局容器组件
import TableOperations from "../../ui/TableOperations";

// 预订表格专属操作组件：整合状态筛选和日期/金额排序功能
function BookingTableOperations() {
  return (
    <TableOperations>
      {/* 预订状态筛选：基于status字段 */}
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "All" },
          { value: "checked-out", label: "Checked out" },
          { value: "checked-in", label: "Checked in" },
          { value: "unconfirmed", label: "Unconfirmed" }
        ]}
      />

      {/* 预订排序：支持入住日期/订单金额的正/倒序 */}
      <SortBy
        options={[
          { value: "startDate-desc", label: "Sort by date (recent first)" },
          { value: "startDate-asc", label: "Sort by date (earlier first)" },
          { value: "totalPrice-desc", label: "Sort by amount (high first)" },
          { value: "totalPrice-asc", label: "Sort by amount (low first)" }
        ]}
      />
    </TableOperations>
  );
}

export default BookingTableOperations;