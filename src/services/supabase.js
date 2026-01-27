// 从supabase官方SDK中导入创建客户端的核心方法
// createClient：用于初始化Supabase客户端，建立前端与Supabase数据库的连接
import { createClient } from '@supabase/supabase-js'

// Supabase项目的基础URL（数据库访问地址）
// 可从Supabase项目后台 → Settings → API → Project URL获取，每个项目唯一
const supabaseUrl = 'https://ttsbwcwwpxdbrlatygoi.supabase.co'

// Supabase项目的【匿名公钥（anon public key）】
// 来源：Supabase项目后台 → Settings → API → Project API keys → anon public
// 核心特性：1. 浏览器安全可用，可直接写在前端代码中；2. 权限受「行级安全策略（RLS）」完全控制；3. 对应Supabase的anon（匿名用户）角色
// 安全注意：严禁将supabase的service_role secret key（服务端密钥）写在这里，该密钥会绕过RLS，泄露会导致数据被任意篡改
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0c2J3Y3d3cHhkYnJsYXR5Z29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNDQ5NzgsImV4cCI6MjA4NDkyMDk3OH0.hEjyQqX98kZOr4U8N1mXODmEYlHJ7sJG3hpQPGeYOUQ"

// 初始化Supabase客户端实例
// 传入两个核心参数：项目URL + 匿名公钥，建立前端与Supabase的持久化连接
// 该实例是前端操作Supabase数据库的唯一入口：所有的增删改查、鉴权等操作都通过此实例完成
const supabase = createClient(supabaseUrl, supabaseKey)

// 导出Supabase客户端实例
// 项目中其他组件/页面可直接导入该实例，无需重复初始化，实现全局单例使用
export default supabase;
export { supabaseUrl };