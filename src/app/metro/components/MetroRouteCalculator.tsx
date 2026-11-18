import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";
import VoiceInputButton from "@/components/VoiceInputButton";
import { MetroRouteCalculatorProps } from "../types";
import { LINE_COLORS, LINE_NAMES } from "../constants";
import { normalizeArabic } from "../utils";
import styles from "../metro.module.css";
import searchStyles from "@/components/common/RouteSearchCard/RouteSearchCard.module.css";
import { IconBrandWhatsapp, IconChevronLeft, IconCurrentLocationFilled, IconInnerShadowTopRightFilled, IconLoader2, IconMapPinFilled, IconMessageReportFilled, IconRoad, IconShare, IconXFilled } from "@tabler/icons-react";
import { ASSETS } from "@/constants/assets";

const POPULAR_METRO_PRESETS = [
  "الشهداء",
  "أنور السادات",
  "العتبة",
  "جامعة القاهرة",
  "كلية البنات",
  "حلوان",
  "شبرا الخيمة",
  "العباسية",
];

export default function MetroRouteCalculator({
  panelRef,
  selectedFrom,
  selectedTo,
  fromQuery,
  toQuery,
  showFromList,
  showToList,
  filteredFrom,
  filteredTo,
  stations,
  onSelectFrom,
  onSelectTo,
  onFromQueryChange,
  onToQueryChange,
  onFromFocus,
  onFromBlur,
  onToFocus,
  onToBlur,
  onSwapStations,
  onFindNearest,
  locatingNearest,
  nearestDistance,
  result,
  onFindRoute,
  isTripActive,
  currentStepIndex,
  copiedRoute,
  whatsappShareUrl,
  onStartTrip,
  onEndTrip,
  onStepNext,
  onShareRoute,
  onOpenReportModal,
}: MetroRouteCalculatorProps) {
  const swapIconRef = useRef<SVGSVGElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const presetsRef = useRef<HTMLDivElement>(null);

  // Entrance animation for preset chips
  useEffect(() => {
    if (presetsRef.current) {
      const chips = presetsRef.current.querySelectorAll(`.${searchStyles.chipTag}`);
      if (chips.length > 0) {
        gsap.fromTo(
          chips,
          { autoAlpha: 0, scale: 0.9 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.35,
            stagger: 0.03,
            ease: "power2.out",
            clearProps: "transform,opacity,visibility",
          }
        );
      }
    }
  }, []);

  // Click outside to dismiss suggestions dropdowns
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        onFromBlur();
        onToBlur();
      }
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, [onFromBlur, onToBlur]);

  const handleSwapClick = () => {
    if (swapIconRef.current) {
      gsap.to(swapIconRef.current, {
        rotation: "+=180",
        duration: 0.35,
        ease: "back.out(1.5)",
      });
    }
    onSwapStations();
  };

  const isSearchDisabled = !selectedFrom || !selectedTo;

  return (
    <div
      ref={panelRef}
      className={styles.searchBentoCard}
      style={{ zIndex: showFromList || showToList ? 50 : 20, position: "relative" }}
    >
      {/* Title & Nearest Station GPS Button */}
      <div className={searchStyles.header}>
        <h2 className={searchStyles.title}>
          <span>علي فين كدا .؟</span>
        </h2>
      </div>

      {/* Search Boxes Container (Styled just like 'إزاي أروح' page) */}
      <div
        ref={searchContainerRef}
        className={searchStyles.searchBoxContainer}
        style={{ position: "relative", zIndex: showFromList || showToList ? 40 : 5 }}
      >
        {/* FROM STATION INPUT */}
        <div
          className={searchStyles.fieldContainer}
          style={{ zIndex: showFromList ? 100 : 2 }}
        >
          <div className={searchStyles.inputWrapper}>
            {/* Left Origin Icon (Clickable to trigger GPS) */}
            <div className={searchStyles.inputStartIcon}>
              <button
                type="button"
                onClick={onFindNearest}
                disabled={locatingNearest}
                title="تحديد أقرب محطة بالـ GPS"
                aria-label="تحديد أقرب محطة بالـ GPS"
                className={searchStyles.inputStartBtn}
              >
                {locatingNearest ? (
                  <IconLoader2 stroke={2} size={16} className="color-primary" />
                ) : (
                  <IconInnerShadowTopRightFilled size={16} className="color-primary" />
                )}
              </button>
            </div>

            {/* Input field */}
            <input
              className={`input-fields ${searchStyles.input}`}
              placeholder="هركب من محطة القاهرة"
              value={fromQuery}
              onChange={(e) => onFromQueryChange(e.target.value)}
              onFocus={onFromFocus}
              onBlur={() => setTimeout(onFromBlur, 250)}
            />

            {/* End actions: Clear button or Voice Input */}
            <div className={searchStyles.inputEndActions}>
              {fromQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    onFromQueryChange("");
                    onSelectFrom("");
                  }}
                  title="مسح"
                  aria-label="مسح المحطة"
                  className="btn-transparent color-muted pointer p-1 flex justify-center content-center"
                >
                  <IconXFilled size={16} />
                </button>
              ) : (
                <VoiceInputButton
                  onTranscript={(text) => {
                    onFromQueryChange(text);
                  }}
                />
              )}
            </div>

            {/* From Suggestions Dropdown */}
            {showFromList && filteredFrom.length > 0 && (
              <div className={searchStyles.suggestionsDropdown}>
                {filteredFrom.slice(0, 10).map((s) => {
                  const q = normalizeArabic(fromQuery.trim());
                  const matchedLandmark = q
                    ? (s.landmarks || []).find((l) =>
                      normalizeArabic(l).includes(q)
                    )
                    : null;
                  return (
                    <button
                      key={s.name}
                      type="button"
                      onMouseDown={() => onSelectFrom(s.name)}
                      className={searchStyles.suggestionItem}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          textAlign: "right",
                        }}
                      >
                        <span>محطة {s.name}</span>
                        {matchedLandmark && (
                          <span className="inline-block gap-1 mt-1">
                            <IconCurrentLocationFilled size={16} className="color-error" />
                            <span className="color-error">   <strong className="color-fg">لو عايز تروح</strong>  {matchedLandmark} </span>
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div style={{ display: "flex", gap: "4px" }}>
                          {s.lines.map((l) => (
                            <span
                              key={l}
                              title={`الخط ${l.replace("line", "")}`}
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: LINE_COLORS[l],
                                display: "inline-block",
                              }}
                            />
                          ))}
                        </div>
                        {s.isTransfer && (
                          <span className="alert-warning px-1 fs-xs rounded">تبادلية</span>
                        )}
                        <IconChevronLeft stroke={2} size={16} className="text-muted" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* SWAP BUTTON - Right Junction centered between inputs */}
        <div className={searchStyles.swapBtnAnchor} style={{ top: "54px" }}>
          <button
            type="button"
            onClick={handleSwapClick}
            title="تبديل المحطات"
            className={searchStyles.swapBtn}
            aria-label="تبديل محطة القيام والوصول"
          >
            <svg
              ref={swapIconRef}
              className={searchStyles.swapIconSvg}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 20V4M7 4L3 8M7 4L11 8M17 4V20M17 20L21 16M17 20L13 16" />
            </svg>
          </button>
        </div>

        {/* TO STATION INPUT */}
        <div
          className={searchStyles.fieldContainer}
          style={{ zIndex: showToList ? 100 : 1 }}
        >
          <div className={searchStyles.inputWrapper}>
            {/* Left Destination Icon */}
            <span className={searchStyles.inputStartIcon}>
              <IconMapPinFilled size={16} className="color-muted" />
            </span>

            {/* Input field */}
            <input
              className={`input-fields ${searchStyles.input}`}
              placeholder="رايح أرض المعارض"
              value={toQuery}
              onChange={(e) => onToQueryChange(e.target.value)}
              onFocus={onToFocus}
              onBlur={() => setTimeout(onToBlur, 250)}
            />

            {/* End actions: Clear button or Voice Input */}
            <div className={searchStyles.inputEndActions}>
              {toQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    onToQueryChange("");
                    onSelectTo("");
                  }}
                  title="مسح"
                  aria-label="مسح المحطة"
                  className="btn-transparent color-muted pointer p-1 flex justify-center content-center"
                >
                  <IconXFilled size={16} />
                </button>
              ) : (
                <VoiceInputButton
                  onTranscript={(text) => {
                    onToQueryChange(text);
                  }}
                />
              )}
            </div>

            {/* To Suggestions Dropdown */}
            {showToList && filteredTo.length > 0 && (
              <div className={searchStyles.suggestionsDropdown}>
                {filteredTo.slice(0, 10).map((s) => {
                  const q = normalizeArabic(toQuery.trim());
                  const matchedLandmark = q
                    ? (s.landmarks || []).find((l) =>
                      normalizeArabic(l).includes(q)
                    )
                    : null;
                  return (
                    <button
                      key={s.name}
                      type="button"
                      onMouseDown={() => onSelectTo(s.name)}
                      className={searchStyles.suggestionItem}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          textAlign: "right",
                        }}
                      >
                        <span>محطة {s.name}</span>
                        {matchedLandmark && (
                          <span className="inline-block gap-1 mt-1">
                            <IconCurrentLocationFilled size={16} className="color-error" />
                            <span className="color-error">   <strong className="color-fg">لو عايز تروح</strong>  {matchedLandmark} </span>
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div style={{ display: "flex", gap: "4px" }}>
                          {s.lines.map((l) => (
                            <span
                              key={l}
                              title={`الخط ${l.replace("line", "")}`}
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: LINE_COLORS[l],
                                display: "inline-block",
                              }}
                            />
                          ))}
                        </div>
                        {s.isTransfer && (
                          <span className="alert-warning px-1 fs-xs rounded">تبادلية</span>
                        )}
                        <IconChevronLeft stroke={2} size={16} className="text-muted" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Preset Destination Chips */}
          <div ref={presetsRef} className={searchStyles.presetChipsWrapper}>
            {POPULAR_METRO_PRESETS.map((dest) => (
              <button
                key={dest}
                type="button"
                onClick={() => onSelectTo(dest)}
                className={`${searchStyles.chipTag} ${selectedTo === dest ? searchStyles.chipTagActive : ""
                  }`}
              >
                {dest}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Location Badge (GPS Nearest Station Result) */}
      {nearestDistance && selectedFrom && (
        <div
          className={searchStyles.locationBadge}
          style={{ marginTop: "12px" }}
        >
          <i
            className="fa-solid fa-location-dot"
            style={{ fontSize: "1rem", flexShrink: 0 }}
          />
          <span>
            أقرب محطة مترو لموقعك: <strong>{selectedFrom}</strong> (
            {nearestDistance})
          </span>
        </div>
      )}

      {/* SEARCH ACTION BUTTON */}
      <button
        type="button"
        onClick={onFindRoute}
        disabled={isSearchDisabled}
        className={`btn btn-primary w-full ${searchStyles.submitBtn} ${isSearchDisabled ? searchStyles.submitBtnDisabled : ""
          }`}
      >
        <i className="bx bx-search-alt" style={{ fontSize: "1.25rem" }} />
        <span>اعرض مسار الرحلة</span>
      </button>

      {/* TRIP RESULTS */}
      {result && (
        <div className={styles.routeResultCard}>
          {/* Not Found State */}
          {!result.found ? (
            <div style={{ textAlign: "center", color: "var(--text-secondary)", padding: "20px 0" }}>
              <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>😕</div>
              <h4 style={{ fontWeight: "700", color: "var(--color-fg)", marginBottom: "6px" }}>
                عذراً، تعذر العثور على مسار
              </h4>
              <p style={{ fontSize: "0.88rem", margin: 0 }}>{result.description}</p>
            </div>
          ) : (
            <>
              {/* Metrics Grid */}
              <div className={styles.metricsGrid}>
                {/* Number of Stations */}
                <div className={styles.metricTile}>
                  <div>
                    <p className={styles.metricTileLabel}>عدد المحطات</p>
                    <p className={styles.metricTileVal}>{result.stationCount} محطة</p>
                  </div>
                </div>

                {/* Ticket Price */}
                <div className={styles.metricTile}>
                  <div>
                    <p className={styles.metricTileLabel}>سعر التذكرة</p>
                    <p className={styles.metricTileVal} style={{ color: "#10b981" }}>{result.price} ج.م</p>
                  </div>
                </div>

                {/* Estimated Time */}
                <div className={styles.metricTile}>
                  <div>
                    <p className={styles.metricTileLabel}>زمن الرحلة</p>
                    <p className={styles.metricTileVal}>{result.estimatedTime} دقيقة</p>
                  </div>
                </div>

                {/* Transfers */}
                <div className={styles.metricTile}>
                  <div>
                    <p className={styles.metricTileLabel}>التحويلات</p>
                    <p className={styles.metricTileVal} style={{ color: result.needsTransfer ? "#f59e0b" : "#10b981" }}>
                      {result.needsTransfer ? `${result.transfers.length} تبديل` : "خط مباشر"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informative Guidance Banner */}
              {!isTripActive && (
                <div className={styles.routeInstructionsBanner}>
                  <i className="bx bxs-info-circle" style={{ color: "var(--color-secondary)", fontSize: "1.2rem", flexShrink: 0 }} />
                  <span>{result.description}</span>
                </div>
              )}

              {/* Action Buttons Row */}
              {!isTripActive && (
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={onStartTrip}
                    className="btn btn-blue flex-auto"
                  >
                    <IconRoad stroke={2} size={18}/>  
                    <span>بدء  الرحلة</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary flex-auto"
                    onClick={onShareRoute}
                  >
                   <IconShare stroke={2} size={18}/>
                    <span>مشاركة المسار</span>
                  </button>

                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whats flex-auto"
                  >
                   <IconBrandWhatsapp stroke={2} size={18}/>
                    <span>مشاركة عبر واتساب</span>
                  </a>
                </div>
              )}

              {/* Active Trip Live Tracker Box */}
              {isTripActive && (
                <div className={styles.stepTrackerBox}>
                  <div className={styles.stepHeader}>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: "700",
                        color: "var(--color-secondary)",
                        background: "rgba(59, 130, 246, 0.12)",
                        padding: "4px 10px",
                        borderRadius: "8px",
                      }}
                    >
                      <i className="fa-solid fa-location-arrow" style={{ marginLeft: "4px" }} />
                      تتبع الرحلة نشط
                    </span>

                    <button
                      type="button"
                      onClick={onEndTrip}
                      style={{
                        border: "none",
                        color: "#ef4444",
                        fontSize: "0.78rem",
                        fontWeight: "700",
                        cursor: "pointer",
                        background: "rgba(239, 68, 68, 0.12)",
                        padding: "4px 10px",
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <i className="fa-solid fa-xmark" style={{ marginLeft: "4px" }} />
                      إنهاء التتبع
                    </button>
                  </div>

                  <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--text-secondary)" }}>
                    أنت الآن في محطة:{" "}
                    <strong style={{ color: "var(--color-fg)", fontSize: "1.1rem" }}>
                      {result.detailedPath[currentStepIndex]?.station}
                    </strong>
                    <span className="inline-block text-muted mr-1 fs-xs">
                      ({currentStepIndex + 1} من {result.detailedPath.length})
                    </span>
                  </div>

                  {(() => {
                    const uniqueRemainingStations = Array.from(
                      new Set(result.detailedPath.slice(currentStepIndex).map((s) => s.station))
                    );
                    const remainingTime = Math.max(0, (uniqueRemainingStations.length - 1) * 2);
                    return (
                      <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>
                        الوقت اللي متوقع توصل فيه:{" "}
                        <strong className="color-primary">{remainingTime} دقيقة</strong>
                      </div>
                    );
                  })()}

                  {result.detailedPath[currentStepIndex]?.isTransferPoint && (
                    <div
                    className="alert-warning"
                      style={{
                        borderRadius: "10px",
                        padding: "12px",
                        fontSize: "0.85rem",
                        lineHeight: "1.6",
                      }}
                    >
                      <div className="flex gap-1 items-center">
                        <Image src={ASSETS.transit.metro} alt="metro" width={20} height={20} />
                         محطة تبديل خطوط المترو!
                      </div>
                      انزل هنا من القطار وتوجه نحو رصيف{" "}
                      <strong
                        style={{
                          color:
                            LINE_COLORS[result.detailedPath[currentStepIndex]?.targetLine!] || "#10b981",
                        }}
                      >
                        {LINE_NAMES[result.detailedPath[currentStepIndex]?.targetLine!]}
                      </strong>{" "}
                      واتبع الإرشادات للركوب في الاتجاه المطلوب.
                    </div>
                  )}

                  {currentStepIndex < result.detailedPath.length - 1 ? (
                    <button
                      type="button"
                      className="btn btn-blue w-full"
                      onClick={onStepNext}
                    >
                      <span>وصلت لمحطة {result.detailedPath[currentStepIndex + 1]?.station} ←</span>
                    </button>
                  ) : (
                    <div
                      className="pt-5 text-center"
                    >
                      <h4 className="font-sub text-primary fs-6 fw-bold">حمدلله على السلامة!</h4>
                      <p className="color-primary mb-4 fs-sm">
                        لقد وصلت إلى محطة {result.detailedPath[currentStepIndex]?.station}.
                      </p>
                      <button
                        type="button"
                        onClick={onEndTrip}
                        className="btn btn-cancel w-full"
                      >
                        إنهاء الرحلة
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Detailed Path Steps List */}
              <div className="bg-secondary border border-glass rounded-lg p-4 "
              >
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "800",
                    color: "var(--color-fg)",
                    margin: "0 0 14px",
                    fontFamily: "var(--font-sub, inherit)",
                  }}
                >
                  مسار الرحلة بالتفصيل ({result.detailedPath.length} محطة)
                </h3>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  {result.detailedPath.map((node, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === result.detailedPath.length - 1;
                    const isTransfer = node.isTransferPoint;
                    const activeColor = LINE_COLORS[node.line] || "#3b82f6";
                    const isPassed = isTripActive && idx < currentStepIndex;
                    const isCurrent = isTripActive && idx === currentStepIndex;

                    const stationObj = stations.find((s) => s.name === node.station);
                    const isUnderConstruction = stationObj?.status === "تحت الإنشاء";

                    return (
                      <div key={idx} style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "34px" }}>
                          {/* Station Dot */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              width: "16px",
                              flexShrink: 0,
                            }}
                          >
                            {isPassed ? (
                              <div
                                style={{
                                  width: "14px",
                                  height: "14px",
                                  borderRadius: "50%",
                                  backgroundColor: "#10b981",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#ffffff",
                                  fontSize: "0.6rem",
                                  fontWeight: "bold",
                                }}
                              >
                                ✓
                              </div>
                            ) : (
                              <div
                                style={{
                                  width: isFirst || isLast || isTransfer ? "12px" : "8px",
                                  height: isFirst || isLast || isTransfer ? "12px" : "8px",
                                  borderRadius: "50%",
                                  backgroundColor: isUnderConstruction
                                    ? "transparent"
                                    : isFirst || isLast
                                      ? activeColor
                                      : isTransfer
                                        ? "#f59e0b"
                                        : activeColor,
                                  border: isUnderConstruction
                                    ? `2px dashed #ef4444`
                                    : isFirst || isLast
                                      ? `2px solid var(--color-bg, #18181b)`
                                      : "none",
                                  boxShadow:
                                    isUnderConstruction
                                      ? "none"
                                      : isFirst || isLast
                                        ? `0 0 0 2px ${activeColor}`
                                        : "none",
                                }}
                              />
                            )}
                          </div>

                          {/* Station Name & Badges */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "8px",
                              flexGrow: 1,
                              opacity: isPassed ? 0.5 : 1,
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                              <span
                                style={{
                                  fontSize: "0.88rem",
                                  fontWeight: isFirst || isLast || isTransfer || isCurrent ? "800" : "600",
                                  color: isUnderConstruction
                                    ? "#ef4444"
                                    : isCurrent
                                      ? "var(--color-secondary, #3b82f6)"
                                      : isFirst || isLast
                                        ? "var(--color-fg)"
                                        : "var(--text-secondary)",
                                }}
                              >
                                {node.station}
                              </span>
                            </div>

                            <span
                              style={{
                                fontSize: "0.58rem",
                                color: "#ffffff",
                                background: activeColor,
                                padding: "2px 4px",
                                borderRadius: "6px",
                                fontWeight: "600",
                              }}
                            >
                              {LINE_NAMES[node.line]?.split(" ")[0] + " " + LINE_NAMES[node.line]?.split(" ")[1]}
                            </span>
                          </div>
                        </div>

                        {/* Connective Line Between Stops */}
                        {!isLast && (
                          <div style={{ display: "flex", gap: "12px", minHeight: "16px" }}>
                            <div
                              style={{
                                width: "16px",
                                display: "flex",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <div
                                style={{
                                  width: "2px",
                                  backgroundColor: activeColor,
                                  minHeight: "16px",
                                  opacity: 0.35,
                                }}
                              />
                            </div>
                            <div style={{ flexGrow: 1 }}>
                              {isTransfer && (
                                <div className="alert-warning my-1 rounded-sm fs-xs fw-700 px-2 py-1"
                                >
                                  محطة تبديل: التحويل إلى {LINE_NAMES[node.targetLine!]}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Route Report Problem Button */}
              <button
                type="button"
                className="btn btn-error min-h-min w-full mt-4"
                onClick={() => onOpenReportModal(null, true)}
              >
                <IconMessageReportFilled size={18} />
                <span>الإبلاغ عن خطأ في المسار</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
