import React from "react";
import { LineId, MetroLineExplorerProps } from "../types";
import { LINE_COLORS, LINE_NAMES, LINE_SHORT_NAMES } from "../constants";
import ProjectBanner from "@/components/common/ProjectBanner";
import styles from "../metro.module.css";
import tl from "./MetroStationsTimeline.module.css";
import { IconCurrentLocationFilled, IconMessageReportFilled } from "@tabler/icons-react";

export default function MetroLineExplorer({
  panelRef,
  selectedLineObj,
  explorerLine,
  line3ActiveBranch,
  onSelectBranch,
  currentExplorerStations,
  expandedStation,
  onToggleStation,
  onSwitchLine,
  stationLinesMap,
  color,
  onOpenReportModal,
}: MetroLineExplorerProps) {
  return (
    <div id="metro-line-explorer-panel" ref={panelRef} className={styles.stationCard}>
      {/* Line Header & Line 3 Branch Tabs */}
      <div className={styles.stationHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div>
            <h2 className={styles.stationName}>{selectedLineObj.name}</h2>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-muted)" }}>
              {selectedLineObj.desc || "استعراض مسار المحطات، المعالم القريبة ومحطات التبديل"}
            </p>
          </div>
        </div>

        {/* Line 3 sub-branches tabs */}
        {explorerLine === "line3" && (
          <div className={styles.branchTabs} >
            {[
              { id: "trunk", name: "الفرع الرئيسي" },
              { id: "branchA", name: "روض الفرج" },
              { id: "branchB", name: "جامعة القاهرة" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectBranch(tab.id as any)}
                className={`${styles.branchTab} ${line3ActiveBranch === tab.id ? styles.branchTabActive : ""}`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details Grid (From, To, Count) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
        <div className={styles.metricTile} style={{ flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: "600" }}>محطة البداية</span>
          <span style={{ fontSize: "0.92rem", fontWeight: "800", color: color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {currentExplorerStations[0]?.name || selectedLineObj.from}
          </span>
        </div>

        <div className={styles.metricTile} style={{ flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: "600" }}>محطة النهاية</span>
          <span style={{ fontSize: "0.92rem", fontWeight: "800", color: color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {currentExplorerStations[currentExplorerStations.length - 1]?.name || selectedLineObj.to}
          </span>
        </div>

        <div className={styles.metricTile} style={{ flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: "600" }}> المحطات</span>
          <span style={{ fontSize: "0.92rem", fontWeight: "800", color: "var(--color-fg)" }}>
            {currentExplorerStations.length > 0 ? `${currentExplorerStations.length} محطة` : "تحت الإنشاء"}
          </span>
        </div>
      </div>

      {/* Detailed stops vertical timeline */}
      <div className={tl.panel}>
        <div className={tl.head}>
          <h3 className={tl.title}>المحطات المسجلة على هذا الخط ({currentExplorerStations.length})</h3>
          <span className={tl.hint}>انقر على اسم المحطة لاستعراض المعالم والأماكن الحيوية</span>
        </div>

        {currentExplorerStations.length > 0 ? (
          <ol className={tl.list} style={{ ["--line-color" as string]: color }}>
            {currentExplorerStations.map((stationObj, idx) => {
              const station = stationObj.name;
              const landmarks = stationObj.landmarks || [];
              const status = stationObj.status || "تشغيل فعلي";
              const isUnderConstruction = status === "تحت الإنشاء";
              const isFirst = idx === 0;
              const isLast = idx === currentExplorerStations.length - 1;
              const allLinesForStation = Array.from(stationLinesMap.get(station) || []);
              const isTransfer = allLinesForStation.length > 1;
              const isOpen = expandedStation === station;

              const dotClass = [
                tl.dot,
                isUnderConstruction ? tl.dotBuilding : isTransfer ? tl.dotTransfer : "",
                !isUnderConstruction && !isTransfer && (isFirst || isLast) ? tl.dotEdge : "",
              ].join(" ");

              return (
                <li key={idx} className={tl.item}>
                  <div className={tl.rail}>
                    <span className={dotClass}>{idx + 1}</span>
                  </div>

                  <div className={tl.body}>
                    <button
                      type="button"
                      className={`${tl.card} ${isOpen ? tl.cardOpen : ""}`}
                      onClick={() => onToggleStation(station)}
                      aria-expanded={isOpen}
                    >
                      <span
                        className={`${tl.name} ${isFirst || isLast || isTransfer ? tl.nameStrong : ""} ${isUnderConstruction ? tl.building : ""}`}
                      >
                        {station}
                        {isFirst && <span className={tl.tag}>بداية الخط</span>}
                        {isLast && <span className={tl.tag}>نهاية الخط</span>}
                        {isUnderConstruction && <span className={tl.tag}>تحت الإنشاء</span>}
                      </span>
                      <i className={`bx bx-chevron-down ${tl.chevron} ${isOpen ? tl.chevronOpen : ""}`} aria-hidden="true" />
                    </button>

                    {isTransfer && (
                      <div className={tl.transfers}>
                        {allLinesForStation
                          .filter((l) => l !== explorerLine)
                          .map((l) => (
                            <button
                              key={l}
                              type="button"
                              className={tl.transferBtn}
                              onClick={() => onSwitchLine(l)}
                              style={{
                                color: LINE_COLORS[l] || "#3b82f6",
                                background: (LINE_COLORS[l] || "#3b82f6") + "1a",
                                border: `1px solid ${(LINE_COLORS[l] || "#3b82f6")}40`,
                              }}
                              title={`انقر للانتقال إلى ${LINE_NAMES[l]}`}
                            >
                              تبادل مع {LINE_SHORT_NAMES[l] || l}
                            </button>
                          ))}
                      </div>
                    )}

                    {isOpen && (
                      <div className={tl.details}>
                        {isUnderConstruction && (
                          <div className={tl.warn}>⚠️ هذه المحطة قيد الإنشاء والتجهيز وليست في الخدمة الفعلية بعد.</div>
                        )}
                        <div className={tl.detailsTitle}>المعالم والأماكن الحيوية القريبة من المحطة:</div>
                        <div className={tl.chips}>
                          {landmarks.length > 0 ? (
                            landmarks.map((landmark: string, lIdx: number) => (
                              <span key={lIdx} className={tl.chip}>
                                <IconCurrentLocationFilled size={16} className="color-error" /> {landmark}
                              </span>
                            ))
                          ) : (
                            <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                              لم يتم تسجيل معالم قريبة لهذه المحطة بعد.
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn btn-error min-h-min p-2 w-full mt-3 fs-sm"
                          onClick={() => onOpenReportModal(station)}
                        >
                          <IconMessageReportFilled size={16} />
                          <span>الإبلاغ عن خطأ في محطة {station}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className={tl.empty}>لا توجد محطات مسجلة لهذا الخط حالياً.</div>
        )}
      </div>
    </div>
  );
}
