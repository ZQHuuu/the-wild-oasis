// 导入styled-components库，用于创建组件专属的样式化组件
import styled from "styled-components";

// 导入木屋创建/编辑表单组件，支持创建/编辑双模式，编辑时传入木屋数据自动填充
import CreateCabinForm from "./CreateCabinForm";
// 导入自定义Hook：封装木屋删除的异步请求逻辑，包含加载状态和删除方法
import { useDeleteCabin } from "./useDeleteCabin";
// 导入工具函数：格式化货币金额，统一项目中价格的展示格式
import { formatCurrency } from "../../utils/helpers";
// 导入react-icons图标组件，分别用于复制、编辑、删除操作的视觉标识
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
// 导入自定义Hook：封装木屋创建的异步请求逻辑，用于实现木屋复制功能
import { useCreateCabin } from "./useCreateCabin";
// 导入通用UI组件：模态框，用于包裹编辑表单和删除确认弹窗，管理弹窗的显示/隐藏
import Modal from "../../ui/Modal";
// 导入通用UI组件：删除确认弹窗，标准化删除操作的确认交互
import ConfirmDelete from "../../ui/ConfirmDelete";
// 导入通用UI组件：表格，使用其Row子组件实现统一的表格行布局
import Table from "../../ui/Table";
// 导入通用UI组件：下拉菜单，封装菜单的触发、列表、按钮样式，统一项目操作菜单交互
import Menus from "../../ui/Menus";

// 木屋图片样式组件：控制图片尺寸、裁剪方式和视觉偏移，保证列表中图片展示效果统一
const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2; // 固定图片宽高比3:2，防止拉伸变形
  object-fit: cover; // 图片裁剪填充，保留核心区域
  object-position: center; // 裁剪时居中显示
  transform: scale(1.5) translateX(-7px); // 图片放大并左移，优化列表中图片的视觉呈现
`;

// 木屋名称样式组件：定制字体、大小、字重和颜色，突出展示木屋名称
const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono"; // 使用项目自定义字体，保证风格统一
`;

// 常规价格样式组件：定制字体和字重，与折扣价做视觉区分
const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

// 折扣价格样式组件：定制字体、字重和专属绿色，视觉上突出折扣信息
const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700); // 绿色系标识折扣，符合用户视觉习惯
`;

/**
 * 木屋列表行组件
 * @param {Object} props - 组件接收的属性
 * @param {Object} props.cabin - 单条木屋的完整数据对象（必传，包含id、名称、价格等所有信息）
 * @returns {JSX.Element} 渲染后的木屋表格行
 */
function CabinRow({ cabin }) {
  // 从删除Hook中解构：删除操作的加载状态、执行删除的方法（自动管理异步请求的状态）
  const { isDeleting, deleteCabin } = useDeleteCabin();
  // 从创建Hook中解构：创建操作的加载状态、执行创建的方法（用于木屋复制功能）
  const { isCreating, createCabin } = useCreateCabin();

  // 解构木屋数据对象，提取需要展示和操作的字段，对id重命名避免命名冲突
  const {
    id: cabinId, // 木屋唯一标识（重命名为cabinId，专用于当前木屋的操作）
    name, // 木屋名称
    maxCapacity, // 木屋最大容纳人数
    regularPrice, // 木屋常规价格
    discount, // 木屋折扣金额
    image, // 木屋图片的网络URL
    description, // 木屋详细描述
  } = cabin;

  /**
   * 处理木屋复制的业务逻辑
   * 功能：点击复制按钮时，复用当前木屋的所有配置数据，仅修改名称为「Copy of 原名称」
   * 优势：无需用户重新填写表单，快速创建相同配置的木屋，提升操作效率
   */
  function handleDuplicate() {
    createCabin({
      name: `Copy of ${name}`, // 复制后的木屋名称添加标识，与原木屋区分
      maxCapacity,
      regularPrice,
      discount,
      image,
      description,
    });
  }

  // 渲染表格行：基于通用Table组件的Row子组件，保证整个表格的布局一致性
  return (
    <Table.Row>
      {/* 木屋缩略图：使用自定义Img样式组件，展示木屋图片，添加alt属性优化可访问性 */}
      <Img src={image} alt={`${name} thumbnail`} />
      {/* 木屋名称：使用自定义Cabin样式组件，突出展示木屋名称 */}
      <Cabin>{name}</Cabin>
      {/* 最大容纳人数：拼接文案，直观展示木屋可容纳的客人数量 */}
      <div>Fits up to {maxCapacity} guests</div>
      {/* 常规价格：调用货币格式化工具，统一价格展示格式（如$99、¥99） */}
      <Price>{formatCurrency(regularPrice)}</Price>
      {/* 折扣金额：有折扣则展示格式化后的折扣价，无折扣展示破折号，保证表格布局整齐 */}
      {discount ? (
        <Discount>{formatCurrency(discount)}</Discount>
      ) : (
        <span>&mdash;</span>
      )}
      {/* 操作区域：将所有操作按钮封装为下拉菜单，简化表格行的视觉布局 */}
      <div>
        {/* 模态框容器：管理当前表格行的编辑、删除弹窗，与下拉菜单联动 */}
        <Modal>
          {/* 通用下拉菜单容器：包裹菜单触发按钮、菜单列表，统一菜单交互 */}
          <Menus.Menu>
            {/* 菜单触发按钮：传入木屋唯一id，保证多个行的菜单独立触发，不冲突 */}
            <Menus.Toggle id={cabinId} />

            {/* 菜单列表：与触发按钮绑定相同id，实现点击触发/隐藏的联动效果 */}
            <Menus.List id={cabinId}>
              {/* 复制木屋按钮：绑定点击事件、禁用状态，带复制图标和文字说明 */}
              <Menus.Button
                icon={<HiSquare2Stack />} // 复制功能的图标标识
                onClick={handleDuplicate} // 点击触发木屋复制逻辑
                disabled={isCreating} // 创建（复制）中时禁用按钮，防止重复操作
              >
                Duplicate
              </Menus.Button>

              {/* 编辑木屋的弹窗触发：点击该菜单按钮，打开名称为edit的模态框 */}
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              {/* 删除木屋的弹窗触发：点击该菜单按钮，打开名称为delete的模态框 */}
              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>

            {/* 编辑木屋的模态框内容：打开时渲染表单组件，传入当前木屋数据实现编辑回显 */}
            <Modal.Window name="edit">
              <CreateCabinForm cabinToEdit={cabin} />
            </Modal.Window>

            {/* 删除木屋的模态框内容：打开时渲染删除确认组件，配置删除相关参数 */}
            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="cabins" // 要删除的资源名称，用于生成确认文案
                disabled={isDeleting} // 删除中时禁用确认按钮，防止重复删除
                onConfirm={() => deleteCabin(cabinId)} // 确认删除时，调用删除方法并传入当前木屋id
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

// 导出组件，供木屋列表页面循环渲染，展示所有木屋数据
export default CabinRow;