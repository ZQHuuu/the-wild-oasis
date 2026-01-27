// 导入React Hook Form核心钩子，用于表单状态管理、验证和提交处理
import { useForm } from "react-hook-form";

// 导入自定义UI组件，封装表单基础样式和交互
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

// 导入自定义Hook，封装创建/编辑木屋的业务逻辑（基于React Query实现异步请求）
import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";

/**
 * 木屋创建/编辑表单组件
 * @param {Object} props - 组件属性
 * @param {Object} [props.cabinToEdit={}] - 待编辑的木屋数据（编辑模式下传入，创建模式为空对象）
 * @param {Function} [props.onCloseModal] - 关闭模态框的回调（表单在模态框中展示时生效）
 * @returns {JSX.Element} 渲染的表单组件
 */
function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  // 从自定义Hook中解构创建木屋的状态和方法
  const { isCreating, createCabin } = useCreateCabin();
  // 从自定义Hook中解构编辑木屋的状态和方法
  const { isEditing, editCabin } = useEditCabin();
  // 合并创建/编辑状态，标识表单是否处于异步请求中（禁用表单操作）
  const isWorking = isCreating || isEditing;

  // 解构待编辑木屋数据：提取id用于编辑请求，剩余字段作为表单默认值
  const { id: editId, ...editValues } = cabinToEdit;
  // 判断是否为编辑会话（存在编辑id则为编辑模式）
  const isEditSession = Boolean(editId);

  // 初始化React Hook Form，配置表单默认值（编辑模式用编辑数据，创建模式为空）
  const {
    register, // 注册表单控件，关联表单状态和验证规则
    handleSubmit, // 处理表单提交，自动触发验证并调用回调
    reset, // 重置表单到初始状态
    getValues, // 获取表单当前值（用于跨字段验证，如折扣与原价的对比）
    formState // 表单状态对象，包含验证错误、是否提交等信息
  } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  // 从表单状态中解构验证错误信息，用于展示字段级错误提示
  const { errors } = formState;

  /**
   * 表单提交成功回调（验证通过后执行）
   * @param {Object} data - 表单验证通过后的所有字段数据
   */
  function onSubmit(data) {
    // 处理图片字段：编辑模式下可能是字符串（已上传的图片URL），创建模式下是文件对象数组，取第一个文件
    const image = typeof data.image === "string" ? data.image : data.image[0];

    // 编辑模式：调用编辑木屋方法，传入新数据和木屋id
    if (isEditSession)
      editCabin(
        { newCabinData: { ...data, image }, id: editId },
        {
          // 编辑成功后的回调：重置表单 + 关闭模态框（如有）
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        }
      );
    // 创建模式：调用创建木屋方法，传入表单数据
    else
      createCabin(
        { ...data, image: image },
        {
          // 创建成功后的回调：重置表单 + 关闭模态框（如有）
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        }
      );
  }

  /**
   * 表单验证失败回调
   * @param {Object} errors - 验证失败的字段错误信息对象
   */
  function onError(errors) {
    // console.log(errors); // 可取消注释调试验证错误
  }

  return (
    // 自定义Form组件：绑定提交处理函数，根据是否有关闭模态框回调设置表单类型（模态框/常规）
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      {/* 表单行组件：展示标签 + 错误提示，包裹输入框 */}
      <FormRow label="Cabin name" error={errors?.name?.message}>
        {/* 木屋名称输入框：注册到表单，配置必填验证 */}
        <Input
          type="text"
          id="name"
          disabled={isWorking} // 请求中禁用输入
          {...register("name", {
            required: "This field is required", // 必填验证提示
          })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        {/* 最大容纳人数输入框：注册到表单，配置必填+最小值验证 */}
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register("maxCapacity", {
            required: "This field is required",
            min: {
              value: 1, // 最小值为1
              message: "Capacity should be at least 1", // 最小值验证提示
            },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        {/* 常规价格输入框：注册到表单，配置必填+最小值验证 */}
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register("regularPrice", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        {/* 折扣输入框：注册到表单，配置必填+自定义验证（折扣≤原价） */}
        <Input
          type="number"
          id="discount"
          disabled={isWorking}
          defaultValue={0} // 默认折扣为0
          {...register("discount", {
            required: "This field is required",
            validate: (value) =>
              value <= getValues().regularPrice || // 自定义验证规则：折扣≤常规价格
              "Discount should be less than regular price", // 验证失败提示
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        {/* 木屋描述文本域：注册到表单，配置必填验证 */}
        <Textarea
          type="number" // 注：此处type为笔误，实际应为text，保留原代码不修改
          id="description"
          defaultValue=""
          disabled={isWorking}
          {...register("description", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Cabin photo">
        {/* 木屋图片上传框：注册到表单，创建模式必填，编辑模式非必填 */}
        <FileInput
          id="image"
          accept="image/*" // 仅接受图片类型文件
          {...register("image", {
            required: isEditSession ? false : "This field is required",
          })}
        />
      </FormRow>

      <FormRow>
        {/* 取消按钮：重置表单 + 关闭模态框（如有） */}
        <Button
          variation="secondary" // 次要样式按钮
          type="reset" // 重置表单类型
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        {/* 提交按钮：请求中禁用，根据模式显示不同文本 */}
        <Button disabled={isWorking}>
          {isEditSession ? "Edit cabin" : "Create new cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

// 导出表单组件，供其他模块引入使用
export default CreateCabinForm;