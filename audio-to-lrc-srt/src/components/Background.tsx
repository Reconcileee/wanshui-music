export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* 基础深色背景 */}
      <div className="absolute inset-0 bg-[#0a0a0c]" />

      {/* 渐变光晕 1 - 蓝色 */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, #0a84ff 0%, transparent 70%)',
          top: '-10%',
          right: '-5%',
          animation: 'float-1 20s ease-in-out infinite',
        }}
      />

      {/* 渐变光晕 2 - 紫色 */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, #bf5af2 0%, transparent 70%)',
          bottom: '10%',
          left: '-8%',
          animation: 'float-2 25s ease-in-out infinite',
        }}
      />

      {/* 渐变光晕 3 - 青色 */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, #5ac8fa 0%, transparent 70%)',
          top: '40%',
          right: '20%',
          animation: 'float-3 22s ease-in-out infinite',
        }}
      />

      {/* 渐变光晕 4 - 粉色 */}
      <div
        className="absolute w-[350px] h-[350px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, #ff6b9d 0%, transparent 70%)',
          bottom: '5%',
          right: '40%',
          animation: 'float-1 28s ease-in-out infinite',
        }}
      />
    </div>
  );
}
