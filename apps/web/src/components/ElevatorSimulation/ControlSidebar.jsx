import { DoorOpen, Package, Hand, RotateCw, Move } from "lucide-react";

export function ControlSidebar({
  elevatorDimensions,
  objectDimensions,
  controlMode,
  onControlModeChange,
  onRotateAbsolute,
  onMove,
  onToggleDoor,
  onReset,
  doorClosed,
  canFit,
  isColliding,
  objectRotation,
  showHuman,
  onShowHumanChange,
  carryingStyle,
  onCarryingStyleChange,
  showSecondHuman,
  onShowSecondHumanChange,
  secondCarryingStyle,
  onSecondCarryingStyleChange,
  collisionMode,
  onCollisionModeChange,
}) {
  const {
    doorHeight,
    setDoorHeight,
    doorWidth,
    setDoorWidth,
    interiorHeight,
    setInteriorHeight,
    interiorWidth,
    setInteriorWidth,
    interiorDepth,
    setInteriorDepth,
  } = elevatorDimensions;

  const {
    objectHeight,
    setObjectHeight,
    objectWidth,
    setObjectWidth,
    objectDepth,
    setObjectDepth,
  } = objectDimensions;

  // Convert radians to degrees
  const toDegrees = (rad) => Math.round((rad * 180) / Math.PI);
  const toRadians = (deg) => (deg * Math.PI) / 180;

  return (
    <div className="w-full md:w-80 bg-white dark:bg-[#1E1E1E] border-r border-gray-200 dark:border-gray-700 overflow-y-auto max-h-screen">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center space-x-2 md:space-x-3 mb-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#0065FF]/10 dark:bg-[#4A90E2]/20 rounded-xl flex items-center justify-center">
              <DoorOpen
                size={18}
                className="text-[#0065FF] dark:text-[#4A90E2] md:w-5 md:h-5"
              />
            </div>
            <h1 className="text-lg md:text-xl font-semibold text-[#111827] dark:text-[#DEDEDE] font-inter">
              エレベーター搬入シミュレーター
            </h1>
          </div>
          <p className="text-xs md:text-sm text-[#6B7280] dark:text-[#9CA3AF] font-inter">
            物体を回転・移動させて、エレベーターに入るか確認できます
          </p>
        </div>

        {/* Elevator Dimensions */}
        <div className="mb-4 md:mb-6">
          <h2 className="text-sm font-semibold text-[#111827] dark:text-[#DEDEDE] mb-3 font-inter flex items-center">
            <DoorOpen size={16} className="mr-2" />
            エレベーター寸法
          </h2>

          <div className="space-y-2 md:space-y-3">
            <div>
              <label className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter block mb-1">
                ドア高さ (cm)
              </label>
              <input
                type="number"
                value={doorHeight}
                onChange={(e) => setDoorHeight(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111827] dark:text-[#DEDEDE] focus:outline-none focus:ring-2 focus:ring-[#0065FF]/20 dark:focus:ring-[#4A90E2]/20"
              />
            </div>

            <div>
              <label className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter block mb-1">
                ドア幅 (cm)
              </label>
              <input
                type="number"
                value={doorWidth}
                onChange={(e) => setDoorWidth(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111827] dark:text-[#DEDEDE] focus:outline-none focus:ring-2 focus:ring-[#0065FF]/20 dark:focus:ring-[#4A90E2]/20"
              />
            </div>

            <div>
              <label className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter block mb-1">
                内部高さ (cm)
              </label>
              <input
                type="number"
                value={interiorHeight}
                onChange={(e) => setInteriorHeight(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111827] dark:text-[#DEDEDE] focus:outline-none focus:ring-2 focus:ring-[#0065FF]/20 dark:focus:ring-[#4A90E2]/20"
              />
            </div>

            <div>
              <label className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter block mb-1">
                内部幅 (cm)
              </label>
              <input
                type="number"
                value={interiorWidth}
                onChange={(e) => setInteriorWidth(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111827] dark:text-[#DEDEDE] focus:outline-none focus:ring-2 focus:ring-[#0065FF]/20 dark:focus:ring-[#4A90E2]/20"
              />
            </div>

            <div>
              <label className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter block mb-1">
                内部奥行き (cm)
              </label>
              <input
                type="number"
                value={interiorDepth}
                onChange={(e) => setInteriorDepth(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111827] dark:text-[#DEDEDE] focus:outline-none focus:ring-2 focus:ring-[#0065FF]/20 dark:focus:ring-[#4A90E2]/20"
              />
            </div>
          </div>
        </div>

        {/* Object Dimensions */}
        <div className="mb-4 md:mb-6">
          <h2 className="text-sm font-semibold text-[#111827] dark:text-[#DEDEDE] mb-3 font-inter flex items-center">
            <Package size={16} className="mr-2" />
            運搬物の寸法
          </h2>

          <div className="space-y-2 md:space-y-3">
            <div>
              <label className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter block mb-1">
                高さ (cm)
              </label>
              <input
                type="number"
                value={objectHeight}
                onChange={(e) => setObjectHeight(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111827] dark:text-[#DEDEDE] focus:outline-none focus:ring-2 focus:ring-[#0065FF]/20 dark:focus:ring-[#4A90E2]/20"
              />
            </div>

            <div>
              <label className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter block mb-1">
                幅 (cm)
              </label>
              <input
                type="number"
                value={objectWidth}
                onChange={(e) => setObjectWidth(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111827] dark:text-[#DEDEDE] focus:outline-none focus:ring-2 focus:ring-[#0065FF]/20 dark:focus:ring-[#4A90E2]/20"
              />
            </div>

            <div>
              <label className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter block mb-1">
                奥行き (cm)
              </label>
              <input
                type="number"
                value={objectDepth}
                onChange={(e) => setObjectDepth(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111827] dark:text-[#DEDEDE] focus:outline-none focus:ring-2 focus:ring-[#0065FF]/20 dark:focus:ring-[#4A90E2]/20"
              />
            </div>
          </div>
        </div>

        {/* Direct Control Mode - Simplified */}
        <div className="mb-4 md:mb-6">
          <h2 className="text-sm font-semibold text-[#111827] dark:text-[#DEDEDE] mb-2 font-inter flex items-center">
            <Hand size={16} className="mr-2" />
            直接操作
          </h2>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter">
            3Dビューで青い物体の矢印をドラッグして移動・回転
          </p>
        </div>

        {/* Fine Rotation Controls with Dials */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#111827] dark:text-[#DEDEDE] mb-3 font-inter flex items-center">
            <RotateCw size={16} className="mr-2" />
            細密回転調整
          </h2>

          <div className="space-y-4">
            {/* X Axis */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                  X軸 (前後傾き)
                </span>
                <input
                  type="number"
                  value={toDegrees(objectRotation.x)}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val)) {
                      onRotateAbsolute("x", toRadians(val));
                    }
                  }}
                  className="w-16 px-2 py-1 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded text-xs text-[#111827] dark:text-[#DEDEDE] text-center focus:outline-none focus:ring-2 focus:ring-[#0065FF]/20"
                />
                <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                  °
                </span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={toDegrees(objectRotation.x)}
                onChange={(e) =>
                  onRotateAbsolute("x", toRadians(Number(e.target.value)))
                }
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#0065FF] dark:accent-[#4A90E2]"
              />
            </div>

            {/* Y Axis */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                  Y軸 (水平回転)
                </span>
                <input
                  type="number"
                  value={toDegrees(objectRotation.y)}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val)) {
                      onRotateAbsolute("y", toRadians(val));
                    }
                  }}
                  className="w-16 px-2 py-1 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded text-xs text-[#111827] dark:text-[#DEDEDE] text-center focus:outline-none focus:ring-2 focus:ring-[#0065FF]/20"
                />
                <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                  °
                </span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={toDegrees(objectRotation.y)}
                onChange={(e) =>
                  onRotateAbsolute("y", toRadians(Number(e.target.value)))
                }
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#0065FF] dark:accent-[#4A90E2]"
              />
            </div>

            {/* Z Axis */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                  Z軸 (左右傾き)
                </span>
                <input
                  type="number"
                  value={toDegrees(objectRotation.z)}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val)) {
                      onRotateAbsolute("z", toRadians(val));
                    }
                  }}
                  className="w-16 px-2 py-1 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded text-xs text-[#111827] dark:text-[#DEDEDE] text-center focus:outline-none focus:ring-2 focus:ring-[#0065FF]/20"
                />
                <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                  °
                </span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={toDegrees(objectRotation.z)}
                onChange={(e) =>
                  onRotateAbsolute("z", toRadians(Number(e.target.value)))
                }
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#0065FF] dark:accent-[#4A90E2]"
              />
            </div>
          </div>
        </div>

        {/* Position Controls */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#111827] dark:text-[#DEDEDE] mb-3 font-inter flex items-center">
            <Move size={16} className="mr-2" />
            位置操作
          </h2>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                左右移動
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => onMove("x", -10)}
                  className="px-3 py-1.5 bg-[#E7EEFF] dark:bg-[#1A2332] text-[#0065FF] dark:text-[#4A90E2] text-xs font-medium rounded-lg hover:bg-[#D4E4FF] dark:hover:bg-[#243040] transition-colors"
                >
                  ← 左
                </button>
                <button
                  onClick={() => onMove("x", 10)}
                  className="px-3 py-1.5 bg-[#E7EEFF] dark:bg-[#1A2332] text-[#0065FF] dark:text-[#4A90E2] text-xs font-medium rounded-lg hover:bg-[#D4E4FF] dark:hover:bg-[#243040] transition-colors"
                >
                  右 →
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                前後移動
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => onMove("z", 10)}
                  className="px-3 py-1.5 bg-[#E7EEFF] dark:bg-[#1A2332] text-[#0065FF] dark:text-[#4A90E2] text-xs font-medium rounded-lg hover:bg-[#D4E4FF] dark:hover:bg-[#243040] transition-colors"
                >
                  ← 手前
                </button>
                <button
                  onClick={() => onMove("z", -10)}
                  className="px-3 py-1.5 bg-[#E7EEFF] dark:bg-[#1A2332] text-[#0065FF] dark:text-[#4A90E2] text-xs font-medium rounded-lg hover:bg-[#D4E4FF] dark:hover:bg-[#243040] transition-colors"
                >
                  奥 →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onToggleDoor}
            className={`w-full py-3 font-semibold text-sm rounded-xl transition-colors ${doorClosed
              ? "bg-[#FEF3C7] dark:bg-[#3D2914] text-[#B88710] dark:text-[#FADB14] hover:bg-[#FDE68A] dark:hover:bg-[#243040]"
              : "bg-[#0065FF] dark:bg-[#4A90E2] text-white hover:bg-[#0052E6] dark:hover:bg-[#3A7BC8]"
              }`}
          >
            {doorClosed ? "ドアを開ける" : "ドアを閉める"}
          </button>

          {/* Advance Options */}
          <div className="mb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider mb-3">
              アドバンスオプション
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#111827] dark:text-[#E5E7EB] font-inter">
                  人型を表示 (170cm)
                </span>
                <button
                  onClick={() => onShowHumanChange(!showHuman)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0065FF] focus:ring-offset-2 dark:focus:ring-offset-[#1F2937] ${showHuman ? "bg-[#0065FF]" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showHuman ? "translate-x-6" : "translate-x-1"
                      }`}
                  />
                </button>
              </div>

              {showHuman && (
                <div>
                  <label className="block text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-1.5 font-inter">
                    持ち方
                  </label>
                  <select
                    value={carryingStyle}
                    onChange={(e) => onCarryingStyleChange(e.target.value)}
                    className="w-full p-2 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111827] dark:text-[#DEDEDE] focus:outline-none focus:ring-2 focus:ring-[#0065FF]/20"
                  >
                    <option value="front">前抱え (Front Carry)</option>
                    <option value="back">背負い (Back Carry)</option>
                    <option value="right">右側持ち (Right Side)</option>
                  </select>
                </div>
              )}

              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => onShowSecondHumanChange(!showSecondHuman)}
                  className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all ${showSecondHuman
                    ? "bg-[#0065FF] text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                >
                  {showSecondHuman ? "✓ " : ""}人型2を表示 (170cm)
                </button>
              </div>

              {showSecondHuman && (
                <div>
                  <label className="block text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-1.5 font-inter">
                    持ち方 (2人目)
                  </label>
                  <select
                    value={secondCarryingStyle}
                    onChange={(e) => onSecondCarryingStyleChange(e.target.value)}
                    className="w-full p-2 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111827] dark:text-[#DEDEDE] focus:outline-none focus:ring-2 focus:ring-[#0065FF]/20"
                  >
                    <option value="front">前抱え (Front Carry)</option>
                    <option value="back">背負い (Back Carry)</option>
                    <option value="right">右側持ち (Right Side)</option>
                    <option value="left">左側持ち (Left Side)</option>
                  </select>
                </div>
              )}

              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <label className="block text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] mb-2 font-inter">
                  衝突時の挙動
                </label>
                <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                  <button
                    onClick={() => onCollisionModeChange("visual")}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${collisionMode === "visual"
                      ? "bg-white dark:bg-[#2C2C2C] text-[#0065FF] dark:text-[#4A90E2] shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      }`}
                  >
                    貫通 (色変化)
                  </button>
                  <button
                    onClick={() => onCollisionModeChange("physical")}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${collisionMode === "physical"
                      ? "bg-white dark:bg-[#2C2C2C] text-[#0065FF] dark:text-[#4A90E2] shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      }`}
                  >
                    停止 (障害物)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onReset}
            className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-[#111827] dark:text-[#DEDEDE] font-semibold text-sm rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            リセット
          </button>
        </div>

        {/* Status */}
        {canFit !== null && (
          <div
            className={`mt-4 p-4 rounded-xl ${canFit
              ? "bg-[#E4F6E8] dark:bg-[#1B4332] text-[#157347] dark:text-[#52C41A]"
              : "bg-[#FDEBF0] dark:bg-[#3A1A1A] text-[#E5383B] dark:text-[#FF7875]"
              }`}
          >
            <div className="font-semibold text-sm mb-1">
              {canFit ? "✓ 搬入可能です" : "✗ 搬入できません"}
            </div>
            <div className="text-xs opacity-90">
              {canFit
                ? "物体はエレベーターに収まり、ドアも閉まります"
                : "物体がはみ出ているか、ドアと干渉しています"}
            </div>
          </div>
        )}

        {isColliding && !doorClosed && (
          <div className="mt-4 p-4 rounded-xl bg-[#FEF3C7] dark:bg-[#3D2914] text-[#B88710] dark:text-[#FADB14]">
            <div className="font-semibold text-sm mb-1">⚠ 干渉警告</div>
            <div className="text-xs opacity-90">
              物体がエレベーターの壁と接触しています
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
