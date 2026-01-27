// 导入表格操作容器组件，统一包裹筛选、排序等表格操作元素
import TableOperations from "../../ui/TableOperations";
// 导入筛选下拉组件，实现数据筛选功能
import Filter from "../../ui/Filter";
// 导入排序下拉组件，实现数据排序功能
import SortBy from "../../ui/SortBy";

// 小屋表格专属操作组件：整合折扣筛选和多维度排序功能，供小屋表格页面使用
function CabinTableOperations() {
  return (
    <TableOperations>
      {/* 折扣筛选：基于discount字段筛选小屋数据 */}
      <Filter
        filterField="discount"
        options={[
          { value: "all", label: "All" },
          { value: "no-discount", label: "No discount" },
          { value: "with-discount", label: "With discount" }
        ]}
      />

      {/* 多维度排序：支持名称/价格/容量的正序/倒序排序 */}
      <SortBy
        options={[
          { value: "name-asc", label: "Sort by name (A-Z)" },
          { value: "name-desc", label: "Sort by name (Z-A)" },
          { value: "regularPrice-asc", label: "Sort by price (low first)" },
          { value: "regularPrice-desc", label: "Sort by price (high first)" },
          { value: "maxCapacity-asc", label: "Sort by capacity (low first)" },
          { value: "maxCapacity-desc", label: "Sort by capacity (high first)" }
        ]}
      />
    </TableOperations>
  );
}

export default CabinTableOperations;