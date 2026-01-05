export function ViewportHeader({ controlMode, isDragging }) {
  return (
    <div className="bg-white dark:bg-[#1E1E1E] border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#111827] dark:text-[#DEDEDE] font-inter">
            3Dビュー
          </h2>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] font-inter">
            {isDragging
              ? controlMode === "translate"
                ? "物体を移動中..."
                : "物体を回転中..."
              : "物体をダブルクリックで選択、ドラッグで操作できます（ドラッグ：回転、右クリック：移動、ホイール：ズーム）"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
              controlMode === "translate"
                ? "bg-[#E7EEFF] dark:bg-[#1A2332] text-[#0065FF] dark:text-[#4A90E2]"
                : "bg-[#FEF3C7] dark:bg-[#3D2914] text-[#B88710] dark:text-[#FADB14]"
            }`}
          >
            {controlMode === "translate" ? "移動モード" : "回転モード"}
          </div>
        </div>
      </div>
    </div>
  );
}
