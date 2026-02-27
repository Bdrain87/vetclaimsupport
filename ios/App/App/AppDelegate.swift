import UIKit
import Capacitor
import WebKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    var currentStep = 0
    var steps: [(String, String, String, Double)] = []

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Clear cached responses on launch so the app fetches fresh content.
        // Only removeAllCachedResponses — do NOT set capacity to 0 or
        // WKWebView can't cache anything during the session and fails to load.
        URLCache.shared.removeAllCachedResponses()

        // Also clear WKWebView's disk/memory/fetch caches (belt-and-suspenders).
        // IMPORTANT: Only clear cache types — NOT localStorage/IndexedDB/cookies,
        // which hold persisted user data (Zustand stores, encryption keys, etc.).
        let dataStore = WKWebsiteDataStore.default()
        let cacheTypes: Set<String> = [
            WKWebsiteDataTypeDiskCache,
            WKWebsiteDataTypeMemoryCache,
            WKWebsiteDataTypeFetchCache
        ]
        dataStore.removeData(ofTypes: cacheTypes, modifiedSince: .distantPast) { }

        let args = ProcessInfo.processInfo.arguments

        if args.contains("--dark-capture") {
            steps = [
                ("setup_all", "", "", 2.0),
                ("reload", "", "", 12.0),
                ("tab", "Home", "dark_dashboard", 3.0),
                ("tab", "My Claim", "dark_conditions", 3.0),
                ("tab", "Tools", "dark_tools_overview", 3.0),
                ("scroll_click", "Personal Statement", "dark_personal_statement", 3.0),
                ("back", "", "", 2.0),
                ("scroll_click", "C&P Exam", "dark_cp_exam", 3.0),
                ("back", "", "", 2.0),
                ("scroll_click", "Rating Calculator", "dark_va_calculator", 3.0),
                ("back", "", "", 2.0),
                ("deep_scroll_click", "Claim Packet", "dark_claim_builder", 5.0),
                ("back", "", "", 2.0),
                ("deep_scroll_click", "Buddy Statement", "dark_buddy_statement", 5.0),
            ]
            DispatchQueue.main.asyncAfter(deadline: .now() + 10.0) { self.run() }
        }
        return true
    }

    func getWebView() -> WKWebView? {
        (window?.rootViewController as? CAPBridgeViewController)?.bridge?.webView
    }

    func run() {
        guard currentStep < steps.count, let wv = getWebView() else {
            try? "ALL_DONE".write(toFile: "/tmp/vcs_dark_status.txt", atomically: true, encoding: .utf8)
            return
        }
        let (action, target, ssName, delay) = steps[currentStep]
        var js = ""
        switch action {
        case "setup_all":
            js = "(function(){try{var profile=localStorage.getItem('vet-user-profile');var p=profile?JSON.parse(profile):{state:{},version:5};p.state.entitlement='lifetime';p.state.hasCompletedOnboarding=true;localStorage.setItem('vet-user-profile',JSON.stringify(p));var onb=localStorage.getItem('vcs_onboarding_progress');var o=onb?JSON.parse(onb):{};o.step=99;localStorage.setItem('vcs_onboarding_progress',JSON.stringify(o));localStorage.setItem('va-claims-theme','dark');localStorage.setItem('liabilityAccepted','true');localStorage.setItem('consentTimestamp',new Date().toISOString());localStorage.setItem('consentTermsVersion','1.1');return 'setup_done'}catch(e){return 'err:'+e.message}})()"
        case "reload":
            js = "(function(){location.reload();return 'reloading'})()"
        case "tab":
            js = "(function(){var b=document.querySelectorAll('button,a,ion-tab-button,[role=tab]');for(var i=0;i<b.length;i++){var t=(b[i].textContent||'').trim();if(t==='\(target)'||t.indexOf('\(target)')>=0){b[i].click();return 'ok:'+t}}return 'nf'})()"
        case "scroll_click":
            js = "(function(){var all=document.querySelectorAll('button,a,[role=button],ion-item,ion-card');for(var i=0;i<all.length;i++){var t=(all[i].textContent||'').trim().substring(0,50);if(t.indexOf('\(target)')>=0){all[i].scrollIntoView({block:'center'});var el=all[i];setTimeout(function(){el.click()},500);return 'clicked:'+t}}return 'not_found'})()"
        case "deep_scroll_click":
            js = "(function(){window.scrollTo(0,document.body.scrollHeight);var containers=document.querySelectorAll('[class*=scroll],[class*=content],ion-content,.scroll-content');for(var c=0;c<containers.length;c++){containers[c].scrollTop=containers[c].scrollHeight}var ic=document.querySelectorAll('ion-content');for(var j=0;j<ic.length;j++){if(ic[j].scrollToBottom)ic[j].scrollToBottom(300)}setTimeout(function(){var all=document.querySelectorAll('button,a,[role=button],ion-item,ion-card,div[class*=tool],div[class*=card],ion-col,ion-row');for(var i=0;i<all.length;i++){var t=(all[i].textContent||'').trim().substring(0,60);if(t.indexOf('\(target)')>=0){all[i].scrollIntoView({block:'center'});var el=all[i];setTimeout(function(){el.click()},500);return}}},1500);return 'deep_scroll_initiated'})()"
        case "back":
            js = "(function(){var b=document.querySelector('ion-back-button');if(b){b.click();return 'ion_back'}var btns=document.querySelectorAll('button');for(var i=0;i<btns.length;i++){var a=(btns[i].getAttribute('aria-label')||'').toLowerCase();if(a.indexOf('back')>=0||a.indexOf('go back')>=0){btns[i].click();return 'back_aria:'+a}}var c=document.querySelector('.back-button,[class*=back-button]');if(c){c.click();return 'back_class'}history.back();return 'history_back'})()"
        default: js = "'?'"
        }
        wv.evaluateJavaScript(js) { result, error in
            let r = result as? String ?? "err:\(error?.localizedDescription ?? "?")"
            let line = "Step \(self.currentStep): \(action) \(target) -> \(r)\n"
            NSLog("VCS_DARK: \(line)")
            if let d = line.data(using: .utf8) {
                if let h = FileHandle(forWritingAtPath: "/tmp/vcs_dark_log.txt") { h.seekToEndOfFile(); h.write(d); h.closeFile() }
                else { FileManager.default.createFile(atPath: "/tmp/vcs_dark_log.txt", contents: d) }
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
                if !ssName.isEmpty {
                    try? ssName.write(toFile: "/tmp/vcs_take_screenshot.txt", atomically: true, encoding: .utf8)
                    DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) { self.currentStep += 1; self.run() }
                } else { self.currentStep += 1; self.run() }
            }
        }
    }

    func applicationWillResignActive(_ application: UIApplication) {}
    func applicationDidEnterBackground(_ application: UIApplication) {}
    func applicationWillEnterForeground(_ application: UIApplication) {}
    func applicationDidBecomeActive(_ application: UIApplication) {}
    func applicationWillTerminate(_ application: UIApplication) {}

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
}
