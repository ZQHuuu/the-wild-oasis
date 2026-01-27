// 导入React基础Hook：useState管理状态、useEffect执行副作用操作
import { useState, useEffect } from "react";

/**
 * 自定义Hook：基于localStorage的持久化状态管理
 * 功能：复用「状态管理+本地存储持久化」逻辑，让状态刷新页面/重启浏览器后不丢失
 * @param {any} initialState - 状态初始值（本地无存储数据时使用）
 * @param {string} key - 本地存储的唯一标识key（用于localStorage存/取数据）
 * @returns {Array} - 返回[状态值, 状态更新函数]，和useState用法完全一致
 */
export function useLocalStorageState(initialState, key) {
  // 初始化状态：优先从localStorage读取数据，无数据则用初始值
  const [value, setValue] = useState(function () {
    // 从本地存储中根据key获取已存储的值（localStorage存的是字符串）
    const storedValue = localStorage.getItem(key);
    // 有存储值则转成JS原类型（JSON.parse），无则使用传入的初始值
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  // 副作用：监听状态值/存储key变化，同步更新到localStorage
  useEffect(
    function () {
      // 将最新的状态值转成字符串（JSON.stringify），存入localStorage对应key中
      // 原因：localStorage仅支持字符串类型存储，需序列化JS对象/数组
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key] // 依赖项：value/key变化时，重新执行存储操作
  );

  // 向外暴露状态值和更新函数，保持和原生useState一致的使用方式
  return [value, setValue];
}