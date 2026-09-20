export type AnalyticsEventName =
  | "tool_view"
  | "file_picker_opened"
  | "files_selected"
  | "scan_started"
  | "scan_completed"
  | "confirmed_target_found"
  | "possible_target_found"
  | "no_supported_metadata_found"
  | "clean_copy_prepared"
  | "verification_passed"
  | "verification_failed"
  | "download_single"
  | "download_zip"
  | "advanced_options_opened"
  | "privacy_clean_enabled"
  | "site_b_clicked"
  | "unsupported_format"
  | "safe_rewrite_failed";

export interface AnalyticsEventPayload {
  page_slug?: string;
  format?: "jpeg" | "png" | "webp";
  file_count_bucket?: "1" | "2-5" | "6-10" | "11-30";
  size_bucket?: "<2MB" | "2-10MB" | "10-25MB";
  has_c2pa?: boolean;
  result?: string;
  processing_time_bucket?: "<500ms" | "500ms-2s" | "2s-5s" | ">5s";
}

export interface AnalyticsAdapter {
  track: (event: AnalyticsEventName, payload?: AnalyticsEventPayload) => void;
}

const noopAdapter: AnalyticsAdapter = {
  track: () => undefined,
};

type ClarityFunction = (command: "event", eventName: AnalyticsEventName) => void;

const clarityAdapter: AnalyticsAdapter = {
  track: (event) => {
    if (typeof window === "undefined") {
      return;
    }

    const clarity = (window as Window & { clarity?: ClarityFunction }).clarity;
    if (typeof clarity !== "function") {
      return;
    }

    // Deliberately send only the fixed event name. File names, image contents,
    // scan findings, and the optional internal payload never leave the browser.
    clarity("event", event);
  },
};

export function getAnalyticsAdapter(): AnalyticsAdapter {
  return typeof window === "undefined" ? noopAdapter : clarityAdapter;
}
