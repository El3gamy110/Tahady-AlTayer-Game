import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-game-bg text-white p-6 md:p-12 font-sans" dir="rtl">
      <div className="max-w-3xl mx-auto bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-game-primary">سياسة الخصوصية</h1>
          <Link to="/" className="text-white/70 hover:text-white flex items-center gap-2 transition-colors">
            <span>العودة</span>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        <div className="space-y-6 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. مقدمة</h2>
            <p>
              مرحباً بك في تطبيق "تحدي عالطاير". نحن نولي أهمية كبيرة لخصوصيتك وحماية بياناتك الشخصية. توضح سياسة الخصوصية هذه كيف نقوم بجمع واستخدام وحماية معلوماتك عند استخدامك لتطبيقنا.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. جمع البيانات</h2>
            <p>
              تطبيقنا مصمم ليكون آمناً وممتعاً. نحن لا نقوم بجمع أي بيانات شخصية حساسة. قد نقوم بجمع بعض المعلومات الأساسية غير المحددة للهوية لتحسين تجربة المستخدم وأداء التطبيق.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. استخدام المعلومات</h2>
            <p>
              يقتصر استخدام أي معلومات يتم جمعها على الأغراض التالية:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-white/70">
              <li>ضمان عمل التطبيق بشكل سليم.</li>
              <li>تحسين وتطوير تجربة اللعب.</li>
              <li>إصلاح الأخطاء والمشاكل التقنية.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. مشاركة البيانات</h2>
            <p>
              نحن لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أي أطراف ثالثة لأغراض تسويقية.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. اتصل بنا</h2>
            <p>
              إذا كان لديك أي أسئلة أو استفسارات حول سياسة الخصوصية هذه، يرجى التواصل معنا.
            </p>
          </section>
          
          <div className="pt-8 mt-8 border-t border-white/10 text-center text-sm text-white/50">
            آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
          </div>
        </div>
      </div>
    </div>
  );
}
