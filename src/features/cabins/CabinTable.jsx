// 导入加载中动画组件：数据请求时展示
import Spinner from "../../ui/Spinner";
// 导入小屋表格行组件：渲染单条小屋数据的表格行
import CabinRow from "./CabinRow";
// 导入自定义hooks：封装小屋数据的请求、状态管理逻辑（获取cabins、isLoading等状态）
import { useCabins } from "./useCabins";
// 导入通用表格组件：提供表格头部、主体的统一布局和样式
import Table from "../../ui/Table";
// 导入菜单容器组件：包裹表格，提供表格相关的菜单/操作布局
import Menus from "../../ui/Menus";
// 导入路由查询参数hooks：获取URL中的searchParams（存储筛选、排序规则）
import { useSearchParams } from "react-router-dom";
// 导入空数据组件：无小屋数据时展示的空状态提示
import Empty from "../../ui/Empty";

// 小屋表格核心组件：负责小屋数据的「筛选+排序+表格渲染」，基于URL查询参数实现筛选排序的状态持久化
function CabinTable() {
  // 从自定义hooks中获取小屋数据和加载状态
  const { isLoading, cabins } = useCabins();
  // 从路由中获取查询参数（searchParams），仅读取不修改（只解构第一个参数）
  const [searchParams] = useSearchParams();

  // 加载中状态：展示Spinner动画，阻止后续渲染
  if (isLoading) return <Spinner />;
  // 无数据状态：展示空数据提示组件，指定资源名称为cabins
  if (!cabins.length) return <Empty resourceName="cabins" />;

  // 1) 折扣筛选逻辑：从URL查询参数中获取筛选规则，无则默认显示全部
  const filterValue = searchParams.get("discount") || "all";
  // 声明筛选后的数据变量
  let filteredCabins;
  // 全部小屋：直接使用原始数据
  if (filterValue === "all") filteredCabins = cabins;
  // 无折扣：筛选出折扣为0的小屋
  if (filterValue === "no-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
  // 有折扣：筛选出折扣大于0的小屋
  if (filterValue === "with-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount > 0);

  // 2) 排序逻辑：从URL查询参数中获取排序规则，无则默认按startDate升序
  const sortBy = searchParams.get("sortBy") || "startDate-asc";
  // 拆分排序规则：按「-」分割为「排序字段」和「排序方向」（如name-asc → [name, asc]）
  const [field, direction] = sortBy.split("-");
  // 定义排序修饰符：升序为1，降序为-1，用于控制排序的正负方向
  const modifier = direction === "asc" ? 1 : -1;
  // 对筛选后的数据进行排序：通过字段值相减实现数值排序，修饰符控制升序/降序
  const sortedCabins = filteredCabins.sort(
    (a, b) => (a[field] - b[field]) * modifier
  );

  return (
    // 菜单容器：包裹表格，提供统一的布局上下文
    <Menus>
      {/* 通用表格组件：指定列宽比例，控制表格各列的宽度分配 */}
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        {/* 表格头部：定义各列的标题 */}
        <Table.Header>
          <div></div> {/* 空列：适配行首的操作/占位 */}
          <div>Cabin</div> {/* 小屋名称列 */}
          <div>Capacity</div> {/* 最大容纳人数列 */}
          <div>Price</div> {/* 价格列 */}
          <div>Discount</div> {/* 折扣列 */}
          <div></div> {/* 空列：适配行尾的操作按钮（编辑/删除等） */}
        </Table.Header>

        {/* 表格主体：传入排序后的最终数据，通过render函数渲染每一行 */}
        <Table.Body
          data={sortedCabins} // 最终渲染的数据源（筛选+排序后）
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />} // 行渲染函数：将单条数据传给CabinRow组件
        />
      </Table>
    </Menus>
  );
}

// 导出组件，供小屋相关页面导入使用
export default CabinTable;