// 导入styled-components用于创建组件专属样式
import styled from "styled-components";

// 导入木屋创建/编辑表单组件（复用表单逻辑，支持创建/编辑双模式）
import CreateCabinForm from "./CreateCabinForm";
// 导入自定义Hook：封装木屋删除的异步请求逻辑（含加载状态、错误处理）
import { useDeleteCabin } from "./useDeleteCabin";
// 导入工具函数：格式化货币金额（统一价格展示格式）
import { formatCurrency } from "../../utils/helpers";
// 导入react-icons的图标组件：用于复制、编辑、删除操作的图标展示
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
// 导入自定义Hook：封装木屋创建的异步请求逻辑（含加载状态、错误处理）
import { useCreateCabin } from "./useCreateCabin";
// 导入通用UI组件：模态框（用于包裹编辑表单、删除确认框）
import Modal from "../../ui/Modal";
// 导入通用UI组件：删除确认弹窗（标准化删除确认交互）
import ConfirmDelete from "../../ui/ConfirmDelete";
// 导入通用UI组件：表格（提供标准化的表格行/列布局）
import Table from "../../ui/Table";

// 木屋图片样式组件：控制图片尺寸、裁剪方式、位置偏移
const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2; // 固定图片宽高比3:2
  object-fit: cover; // 图片裁剪填充，保持比例不拉伸
  object-position: center; // 图片裁剪时居中显示
  transform: scale(1.5) translateX(-7px); // 图片放大并左移，调整视觉展示效果
`;

// 木屋名称样式组件：控制字体、大小、颜色、字重
const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono"; // 自定义字体，统一项目风格
`;

// 常规价格样式组件：控制字体和字重
const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

// 折扣价格样式组件：控制字体、字重、专属绿色（突出折扣信息）
const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700); // 绿色系，视觉上区分折扣与原价
`;

/**
 * 木屋列表行组件
 * 作用：渲染单条木屋数据的表格行，包含木屋信息展示+操作按钮（复制/编辑/删除）
 * @param {Object} props - 组件属性
 * @param {Object} props.cabin - 单条木屋的完整数据对象（必传）
 * @returns {JSX.Element} 渲染的木屋表格行
 */
function CabinRow({ cabin }) {
  // 从删除Hook中解构：删除加载状态、删除执行方法（自动管理异步请求状态）
  const { isDeleting, deleteCabin } = useDeleteCabin();
  // 从创建Hook中解构：创建加载状态、创建执行方法（用于复制木屋功能）
  const { isCreating, createCabin } = useCreateCabin();

  // 解构木屋数据对象，提取需要展示和操作的字段（解构赋值简化后续使用）
  const {
    id: cabinId, // 木屋唯一标识（重命名为cabinId，避免与其他id冲突）
    name, // 木屋名称
    maxCapacity, // 最大容纳人数
    regularPrice, // 常规价格
    discount, // 折扣金额
    image, // 木屋图片URL
    description, // 木屋描述
  } = cabin;

  /**
   * 处理木屋复制逻辑
   * 功能：点击复制按钮时，调用创建方法，复用当前木屋的所有数据，仅修改名称为“Copy of 原名称”
   * 优势：无需用户重新填写表单，快速创建相同配置的木屋
   */
  function handleDuplicate() {
    createCabin({
      name: `Copy of ${name}`, // 复制后的木屋名称，增加标识区分原木屋
      maxCapacity,
      regularPrice,
      discount,
      image,
      description,
    });
  }

  // 渲染表格行：基于通用Table组件的Row子组件，保证表格布局统一
  return (
    <Table.Row>
      {/* 木屋图片：使用自定义Img样式组件，展示木屋缩略图 */}
      <Img src={image} alt={name} />
      {/* 木屋名称：使用自定义Cabin样式组件，突出展示名称 */}
      <Cabin>{name}</Cabin>
      {/* 最大容纳人数：拼接文案，直观展示可容纳客人数量 */}
      <div>Fits up to {maxCapacity} guests</div>
      {/* 常规价格：调用货币格式化工具，统一价格展示（如$100、¥100） */}
      <Price>{formatCurrency(regularPrice)}</Price>
      {/* 折扣金额：有折扣则展示格式化后的折扣价，无折扣则展示破折号（统一布局） */}
      {discount ? (
        <Discount>{formatCurrency(discount)}</Discount>
      ) : (
        <span>&mdash;</span>
      )}
      {/* 操作按钮区：包含复制、编辑、删除三个功能按钮 */}
      <div>
        {/* 复制木屋按钮：创建中时禁用，避免重复复制；点击触发handleDuplicate */}
        <button disabled={isCreating} onClick={handleDuplicate}>
          <HiSquare2Stack />
        </button>

        {/* 模态框容器：统一管理编辑、删除的弹窗展示/隐藏（基于Modal组件的多弹窗管理） */}
        <Modal>
          {/* 编辑木屋的弹窗触发按钮：点击打开名称为“edit”的模态框 */}
          <Modal.Open opens="edit">
            <button>
              <HiPencil /> {/* 编辑图标 */}
            </button>
          </Modal.Open>
          {/* 编辑木屋的弹窗内容：打开时渲染CreateCabinForm，传入当前木屋数据作为编辑默认值 */}
          <Modal.Window name="edit">
            <CreateCabinForm cabinToEdit={cabin} />
          </Modal.Window>

          {/* 删除木屋的弹窗触发按钮：点击打开名称为“delete”的模态框 */}
          <Modal.Open opens="delete">
            <button>
              <HiTrash /> {/* 删除图标 */}
            </button>
          </Modal.Open>
          {/* 删除木屋的弹窗内容：打开时渲染确认删除组件，配置删除相关参数 */}
          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="cabins" // 要删除的资源名称（用于确认文案：Are you sure to delete this cabin?）
              disabled={isDeleting} // 删除中时禁用确认按钮，避免重复删除
              onConfirm={() => deleteCabin(cabinId)} // 确认删除时，调用删除方法并传入当前木屋ID
            />
          </Modal.Window>
        </Modal>
      </div>
    </Table.Row>
  );
}

// 导出组件，供木屋列表页面（如CabinList）循环渲染，展示所有木屋数据
export default CabinRow;