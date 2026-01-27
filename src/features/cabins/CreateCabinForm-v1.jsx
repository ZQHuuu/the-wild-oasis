// 导入React Query相关钩子，用于处理异步数据请求和缓存
import { useMutation, useQueryClient } from "@tanstack/react-query";
// 导入react-hot-toast用于显示轻量级的提示消息
import { toast } from "react-hot-toast";

// 导入自定义UI组件
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

// 导入react-hook-form核心钩子，用于表单状态管理和验证
import { useForm } from "react-hook-form";
// 导入创建木屋的API请求函数
import { createCabin } from "../../services/apiCabins";

/**
 * 创建木屋的表单组件
 * 功能：提供表单界面，收集木屋相关信息，完成表单验证并提交创建请求
 */
function CreateCabinForm() {
  // 解构react-hook-form的核心方法和状态
  // register: 注册表单输入项，关联表单状态
  // handleSubmit: 处理表单提交，自动触发验证
  // reset: 重置表单到初始状态
  // getValues: 获取指定表单字段的值
  // formState: 表单状态对象，包含验证错误、是否提交等信息
  const { register, handleSubmit, reset, getValues, formState } = useForm();
  // 从表单状态中解构验证错误信息
  const { errors } = formState;

  // 获取QueryClient实例，用于操作React Query的缓存
  const queryClient = useQueryClient();

  // 使用useMutation创建异步提交的mutation
  // 用于处理创建木屋的POST请求
  const { mutate, isLoading: isCreating } = useMutation({
    // 指定mutation的核心函数：调用创建木屋的API
    mutationFn: createCabin,
    // 请求成功后的回调函数
    onSuccess: () => {
      // 显示成功提示
      toast.success("New cabin successfully created");
      // 使"cabins"相关的查询缓存失效，触发重新获取最新数据
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      // 重置表单到初始状态
      reset();
    },
    // 请求失败后的回调函数
    onError: (err) => toast.error(err.message),
  });

  /**
   * 表单提交成功（验证通过）后的处理函数
   * @param {Object} data 表单收集的所有数据
   */
  function onSubmit(data) {
    // 调用mutation的mutate方法提交数据
    // 处理图片字段：取文件数组的第一个元素（FileInput返回的是文件数组）
    mutate({ ...data, image: data.image[0] });
  }

  /**
   * 表单验证失败后的处理函数
   * @param {Object} errors 表单验证错误信息对象
   */
  function onError(errors) {
    // console.log(errors);
  }

  // 渲染表单组件
  return (
    /* 表单容器，绑定提交处理函数（先验证，通过则调onSubmit，失败则调onError） */
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      {/* 木屋名称输入行：显示标签和错误提示 */}
      <FormRow label="Cabin name" error={errors?.name?.message}>
        {/* 文本输入框：禁用状态跟随创建中状态，注册字段并添加必填验证 */}
        <Input
          type="text"
          id="name"
          disabled={isCreating}
          {...register("name", {
            required: "This field is required",
          })}
        />
      </FormRow>

      {/* 最大容纳人数输入行 */}
      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        {/* 数字输入框：注册字段，添加必填和最小值验证（至少1人） */}
        <Input
          type="number"
          id="maxCapacity"
          disabled={isCreating}
          {...register("maxCapacity", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>

      {/* 常规价格输入行 */}
      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        {/* 数字输入框：注册字段，添加必填和最小值验证（至少1） */}
        <Input
          type="number"
          id="regularPrice"
          disabled={isCreating}
          {...register("regularPrice", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>

      {/* 折扣输入行 */}
      <FormRow label="Discount" error={errors?.discount?.message}>
        {/* 数字输入框：默认值0，注册字段，添加必填和自定义验证（折扣≤常规价格） */}
        <Input
          type="number"
          id="discount"
          disabled={isCreating}
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
            validate: (value) =>
              value <= getValues().regularPrice ||
              "Discount should be less than regular price",
          })}
        />
      </FormRow>

      {/* 网站描述输入行 */}
      <FormRow
        label="Description for website"
        disabled={isCreating}
        error={errors?.description?.message}
      >
        {/* 文本域：注册字段，添加必填验证 */}
        <Textarea
          type="number"
          id="description"
          defaultValue=""
          disabled={isCreating}
          {...register("description", {
            required: "This field is required",
          })}
        />
      </FormRow>

      {/* 木屋照片上传行 */}
      <FormRow label="Cabin photo">
        {/* 文件输入框：仅接受图片类型，注册字段并添加必填验证 */}
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: "This field is required",
          })}
        />
      </FormRow>

      {/* 表单操作按钮行 */}
      <FormRow>
        {/* type is an HTML attribute! */}
        {/* 取消按钮：重置类型，点击后重置表单 */}
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        {/* 添加木屋按钮：创建中状态下禁用 */}
        <Button disabled={isCreating}>Add cabin</Button>
      </FormRow>
    </Form>
  );
}

// 导出组件供外部使用
export default CreateCabinForm;