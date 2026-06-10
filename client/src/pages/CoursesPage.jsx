import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const COURSES = [
  {
    key:'zhongkao', label:'中考数学',
    title:'中考数学课程',
    desc:'针对各地中考命题特点，系统巩固基础知识，专项突破压轴题型。',
    info:[
      '<strong>适用学生：</strong>初中各年级学生，特别是初三备考阶段',
      '<strong>教学重点：</strong>基础知识点地毯式梳理、压轴题分类专项突破、模考实战与应试技巧',
      '<strong>授课形式：</strong>一对一在线授课，按学期或假期集中强化',
    ],
    outline:[
      '数与式、方程与不等式系统复习',
      '函数（一次、二次、反比例）与图像综合应用',
      '几何证明与计算（三角形、四边形、圆）',
      '统计与概率基础',
      '压轴题分类专项：函数综合、几何综合、新定义题',
      '全真模拟测试 + 错题分析 + 考前冲刺',
    ],
  },
  {
    key:'gaokao', label:'高考数学',
    title:'高考数学课程',
    desc:'覆盖全国卷与新高考卷，构建完整知识体系，培养核心数学思维与应试能力。',
    info:[
      '<strong>适用学生：</strong>高中各年级学生，高一高二同步提升或高三总复习',
      '<strong>教学重点：</strong>知识体系结构化梳理、核心考点精讲、解题思维训练、套卷实战演练',
      '<strong>授课形式：</strong>一对一在线授课，按学习阶段定制进度',
    ],
    outline:[
      '函数与导数：函数性质、导数应用、不等式证明',
      '解析几何：圆锥曲线、直线与圆、参数方程',
      '立体几何与空间向量：点线面关系、空间角与距离',
      '概率统计：排列组合、概率模型、统计推断',
      '数列与三角函数综合',
      '选填专项训练 + 解答题规范书写 + 全真模拟',
    ],
  },
  {
    key:'alevel', label:'A-Level 数学',
    title:'A-Level 数学课程',
    desc:'覆盖 CIE、Edexcel、AQA 等主流考试局，Pure Math + Mechanics + Statistics 全面覆盖。',
    info:[
      '<strong>适用学生：</strong>国际学校 / 英国高中在读，AS 或 A2 阶段',
      '<strong>教学重点：</strong>纯数核心推理能力培养、力学与统计应用建模、历年真题透析与 A* 冲刺',
      '<strong>授课形式：</strong>一对一在线授课，按考试季制定备考计划',
    ],
    outline:[
      'Pure Math 1-4：代数、函数、三角学、微积分、向量、复数',
      'Mechanics 1-2：运动学、力学、刚体平衡、功与能量',
      'Statistics 1-2：数据描述、概率、分布、假设检验',
      '分考试局真题分类训练 + 题型归纳',
      '考前模拟冲刺 + 答题规范训练',
    ],
  },
  {
    key:'ib', label:'IB 数学',
    title:'IB 数学课程',
    desc:'覆盖 Analysis & Approaches (AA) 与 Applications & Interpretation (AI) 两大方向，从 SL 到 HL 全程陪伴。',
    info:[
      '<strong>适用学生：</strong>国际学校 IBDP 在读学生，G11–G12',
      '<strong>教学重点：</strong>核心概念深度理解、IA 内部评估论文全程指导、真题精讲与 7 分冲刺策略',
      '<strong>授课形式：</strong>一对一在线授课，每周 1-3 次，每次 90 分钟',
    ],
    outline:[
      '函数与方程（含三角函数、指数对数函数）',
      '微积分基础与进阶（极限、导数、积分应用）',
      '概率与统计（概率分布、假设检验）',
      '向量与矩阵（空间几何、线性变换）',
      'IA 论文选题、建模、写作与修改全流程指导',
      '历年真题分类精练 + 模拟冲刺',
    ],
  },
]

const COMPARISON = [
  ['适用学段','初中 7-9 年级','高中 10-12 年级','国际学校 AS / A2','国际学校 G11-G12'],
  ['课程体系','中国义务教育大纲','全国卷 / 新高考','CIE / Edexcel / AQA','IBDP AA / AI'],
  ['难度等级','分层提升','基础→压轴递进','AS / A2 递进','SL / HL 可选'],
  ['特色要求','本地化命题','综合能力考查','模块化考试','IA 论文 + 探究报告'],
  ['建议课时','每周 1-2 次','每周 2 次','每周 1-2 次','每周 2-3 次'],
  ['单次时长','60-90 分钟','90 分钟','90 分钟','90 分钟'],
]

export default function CoursesPage() {
  const [active, setActive] = useState('zhongkao')
  const course = COURSES.find(c => c.key === active)

  return (
    <div>
      <section className="page-header">
        <div className="container"><h1>课程体系</h1><p>四大课程方向，精准匹配你的学习需求</p></div>
      </section>

      <section className="section">
        <div className="container">
          <div className="course-tabs">
            {COURSES.map(c => (
              <button key={c.key} className={`course-tab-btn ${active===c.key?'active':''}`} onClick={()=>setActive(c.key)}>
                {c.label}
              </button>
            ))}
          </div>

          {course && (
            <div className="course-panel active" key={active}>
              <div className="course-panel-grid">
                <div>
                  <h3>{course.title}</h3>
                  <p style={{color:'var(--color-gray)',marginBottom:24}}>{course.desc}</p>
                  <ul className="info-list">
                    {course.info.map((info,i) => <li key={i} dangerouslySetInnerHTML={{__html:info}} />)}
                  </ul>
                </div>
                <div className="course-highlight">
                  <h4>课程大纲核心模块</h4>
                  <ol>{course.outline.map((o,i) => <li key={i}>{o}</li>)}</ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section section-gray">
        <div className="container">
          <h2 className="section-title">课程横向对比</h2>
          <p className="section-subtitle">帮助你快速了解各课程的定位与特点</p>
          <div className="table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>对比维度</th><th>中考数学</th><th>高考数学</th><th>A-Level 数学</th><th>IB 数学</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row,i) => (
                  <tr key={i}>{row.map((cell,j) => j===0 ? <td key={j}><strong>{cell}</strong></td> : <td key={j}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="footer-cta">
        <div className="container">
          <h2>不确定哪个课程适合你？</h2>
          <p>预约试听课，我会根据你的情况给出最合适的课程方案</p>
          <Link to="/contact" className="btn btn-primary btn-lg">免费获取课程规划</Link>
        </div>
      </section>
    </div>
  )
}
