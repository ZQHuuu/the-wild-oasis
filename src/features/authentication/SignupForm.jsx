import { useForm } from "react-hook-form"; // 导入表单核心Hook
import Button from "../../ui/Button"; // 导入自定义按钮组件
// 以下都是导入项目通用UI组件，语法和普通组件导入一致
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useSignup } from "./useSignup"; // 导入自定义注册Hook（封装注册请求）

// 邮箱校验正则：匹配标准邮箱格式
// Email regex: /\S+@\S+\.\S+/

function SignupForm() {
  // 获取注册方法和加载状态
  const { signup, isLoading } = useSignup();
  // 初始化react-hook-form表单方法
  const { register, formState, getValues, handleSubmit, reset } = useForm();
  // 解构表单校验错误信息
  const { errors } = formState;

  // 表单提交处理函数
  function onSubmit({ fullName, email, password }) {
    signup(
      { fullName, email, password },
      {
        onSettled: () => reset(),
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {/* 姓名输入项 */}
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isLoading}
          {...register("fullName", { required: "This field is required" })}
        />
      </FormRow>

      {/* 邮箱输入项 */}
      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isLoading}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address",
            },
          })}
        />
      </FormRow>

      {/* 密码输入项 - 最少8位 */}
      <FormRow
        label="Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          disabled={isLoading}
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
        />
      </FormRow>

      {/* 确认密码输入项 - 与密码一致 */}
      <FormRow label="Repeat password" error={errors?.passwordConfirm?.message}>
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isLoading}
          {...register("passwordConfirm", {
            required: "This field is required",
            validate: (value) =>
              value === getValues().password || "Passwords need to match",
          })}
        />
      </FormRow>

      {/* 表单操作按钮 - 取消/注册 */}
      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
          disabled={isLoading}
          onClick={reset}
        >
          Cancel
        </Button>
        <Button disabled={isLoading}>Create new user</Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;