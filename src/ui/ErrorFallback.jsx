// 导入 styled-components 库，用于创建样式化 React 组件
import styled from "styled-components";
// 导入自定义的 Heading 标题组件（用于统一标题样式）
import Heading from "./Heading";
// 导入全局样式组件（用于应用项目通用样式，如重置样式、变量等）
import GlobalStyles from "../styles/GlobalStyles";
// 导入自定义的 Button 按钮组件（用于统一按钮样式和交互）
import Button from "./Button";

// 定义错误回退页面的外层容器样式组件
const StyledErrorFallback = styled.main`
  /* 容器高度占满视口，确保错误页面全屏展示 */
  height: 100vh;
  /* 背景色使用全局灰色变量（浅灰），贴合项目视觉风格 */
  background-color: var(--color-grey-50);
  /* Flex 布局：水平+垂直居中内部内容 */
  display: flex;
  align-items: center;
  justify-content: center;
  /* 内边距，避免内容贴边，提升移动端适配性 */
  padding: 4.8rem;
`;

// 定义错误提示内容的盒子样式组件
const Box = styled.div`
  /* 背景色为白色（全局变量），突出内容区域 */
  background-color: var(--color-grey-0);
  /* 浅灰色边框，区分内容区和背景 */
  border: 1px solid var(--color-grey-100);
  /* 圆角边框，使用全局圆角变量（中等），统一视觉风格 */
  border-radius: var(--border-radius-md);

  /* 内边距，增加内容区的留白 */
  padding: 4.8rem;
  /* Flex 收缩/增长：宽度自适应，最大宽度96rem，避免内容过宽 */
  flex: 0 1 96rem;
  /* 文本居中对齐，提升视觉整洁度 */
  text-align: center;

  /* 后代选择器：设置 Box 内 h1 标题的样式 */
  & h1 {
    /* 底部外边距，分隔标题和下方文本 */
    margin-bottom: 1.6rem;
  }

  /* 后代选择器：设置 Box 内 p 文本的样式 */
  & p {
    /* 使用 Sono 字体（项目自定义字体），区分正文和标题 */
    font-family: "Sono";
    /* 底部外边距，分隔文本和下方按钮 */
    margin-bottom: 3.2rem;
    /* 文本颜色使用中灰色变量，弱化错误信息视觉权重，避免刺眼 */
    color: var(--color-grey-500);
  }
`;

/**
 * 错误回退组件（Error Boundary 配套组件）
 * 作用：当 React 组件渲染出错时，展示友好的错误提示页面，而非白屏/控制台报错
 * @param {Object} props - 组件属性
 * @param {Error} props.error - 错误对象，包含错误信息（message）等
 * @param {Function} props.resetErrorBoundary - 重置错误边界的函数，点击“重试”时触发
 * @returns {JSX.Element} 错误回退页面
 */
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <>
      {/* 引入全局样式，确保错误页面样式与项目统一 */}
      <GlobalStyles />
      {/* 错误页面外层容器 */}
      <StyledErrorFallback>
        {/* 错误内容盒子 */}
        <Box>
          {/* 错误标题：使用自定义 Heading 组件，as="h1" 指定渲染为 h1 标签 */}
          <Heading as="h1">Something went wrong 🧐</Heading>
          {/* 展示具体的错误信息（从 error 对象中获取） */}
          <p>{error.message}</p>
          {/* 重试按钮：点击时调用 resetErrorBoundary 重置错误边界，尝试重新渲染组件 */}
          <Button size="large" onClick={resetErrorBoundary}>
            Try again
          </Button>
        </Box>
      </StyledErrorFallback>
    </>
  );
}

// 导出组件，供 Error Boundary 组件调用
export default ErrorFallback;