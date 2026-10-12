# Technical progress — 2026-10-12

التدقيق مبني على بيانات GitHub الحالية ومقارنة ملفات الفروع مع `main`. لم يتم دمج أي PR ضمن هذه المهمة.

| PR | المهمة | حالة GitHub | الفحص التقني | القرار / الخطوة التالية |
|---:|---|---|---|---|
| [#34](https://github.com/home-project-wise/home-project-wise/pull/34) | crawl-space hero JPEG | مفتوح؛ `mergeable=true`؛ فحوص `quality` و`health` ناجحة | صورة hero بصيغة JPEG، أبعادها الفعلية 1400×788 وحجمها 107,521 بايت (<300 KB). `og:image` و`twitter:image` وJSON-LD تشير إلى الصورة نفسها؛ `img src` نسبي ومقبول وفق التفويض. 20 رابطًا و10 قيم `src` و9 قيم `alt` متطابقة بين المقالة الحالية والفرع. النسخة القديمة محفوظة في المستودع (1,496,753 بايت) لكنها ليست صورة hero الحالية. فرع PR يضع مهمة الصورة `done` بينما `main` ما زال يعرض `pr-open`. | **مقبول تقنيًا مبدئيًا**؛ لم يُدمج بعد، وحالة GitHub ما زالت `pending/unstable` رغم نجاح الفحصين. |
| [#35](https://github.com/home-project-wise/home-project-wise/pull/35) | condensation hero | مدموج | تم التحقق سابقًا؛ دمج ناجح مع الحفاظ على صفوف تتبع المهام. | مكتمل. |
| [#36](https://github.com/home-project-wise/home-project-wise/pull/36) | hang-large-wall-art | مدموج | تم التحقق سابقًا؛ المقالة وملف التتبع فقط، الروابط والصور لم تتغير، والصفوف محفوظة. | مكتمل. |
| [#37](https://github.com/home-project-wise/home-project-wise/pull/37) | drafty-door | مدموج | تم التحقق سابقًا؛ 17 رابطًا مطابقًا للأصل، و`src/alt` للصور لم يتغيرا، وصفوف التتبع محفوظة. | مكتمل. |
| [#38](https://github.com/home-project-wise/home-project-wise/pull/38) | reduce-cable-clutter | مفتوح؛ `mergeable=false` (`dirty`)؛ `quality` ناجح و`health` ملغى | 17 رابطًا مطابقًا، ووسوم `head` متطابقة. لكن الفرع يحتوي 5 قيم `img src` مقابل 6 على `main`؛ الرسم `../images/cable-before-after.svg` الموجود في المقالة الحالية غير موجود في نسخة المقالة بالفرع. ملف `editorial_progress.md` يحتفظ بصفوف المقالات، لكنه يعيد حالة #40 من `pr-open` إلى `pending`. | **لا تدمج الآن**؛ حل التعارض/تحديث الفرع مع الاحتفاظ برسم الكابلات الموجود على `main` وتصحيح صف التتبع الذي تراجع. |
| [#39](https://github.com/home-project-wise/home-project-wise/pull/39) | small-bathroom-easier-to-clean | مفتوح؛ `mergeable=false` (`dirty`)؛ `health` ملغى | 20 رابطًا مطابقًا، و5 قيم `src` و4 قيم `alt` وبيانات `head` متطابقة. جميع صفوف المقالات موجودة في نسخة التتبع، لكن حالة #40 تتراجع من `pr-open` إلى `pending`. | **لا تدمج الآن**؛ حل التعارض مع الحفاظ على الحالة الصحيحة لصف #40؛ فحص `quality` غير ظاهر في نتيجة الفحوص الحالية. |
| [#40](https://github.com/home-project-wise/home-project-wise/pull/40) | evening-lighting | مدموج | تم التحقق سابقًا؛ 17 رابطًا مطابقًا للأصل، و`src/alt` للصور لم يتغيرا. | مكتمل. |
| [#41](https://github.com/home-project-wise/home-project-wise/pull/41) | calm-room | مفتوح؛ `mergeable=false` (`dirty`)؛ `health` ملغى | 10 روابط مطابقة، و6 قيم `src` و5 قيم `alt` وبيانات `head` متطابقة. صفوف التتبع محفوظة، مع إضافة حالة #41 إلى الصف الصحيح. | **لا تدمج الآن**؛ حل التعارض أولًا؛ فحص `quality` غير ظاهر في نتيجة الفحوص الحالية. |
| 6 PRs جديدة من Claude (أرقام غير معروفة) | مجموعة إضافية غير محددة | لم تُعثر عليها في المستودع | استجابة GitHub الحالية تعرض 55 PR فقط، وأحدثها #55؛ لا توجد ستة PRs إضافية قابلة للتحديد. PRs #42–#48 هي مجموعة SVG موجودة بالفعل، وليست مجموعة جديدة يمكن نسبتها إلى Claude بناءً على البيانات المتاحة. | **غير مدققة**؛ يلزم ظهورها في المستودع أو تحديد أرقامها لتدقيقها دون تخمين. |

| [#56](https://github.com/home-project-wise/home-project-wise/pull/56) | kitchen-counter-zone-that-stays-clear | مدموج | الملفان المعدلان فقط هما المقالة و`data/editorial_progress.md`. قائمة الروابط مطابقة بين الفرع و`main` (15 رابطًا فعليًا، لا 17)، و`img src/alt` لم يتغيرا. دُمج PR ثم حُدّث صف المقالة إلى `done` مع الحفاظ على صفوف التتبع الـ17. | مكتمل؛ لا تعديلات يدوية على المقالة. |

| [#57](https://github.com/home-project-wise/home-project-wise/pull/57) | make-small-living-room-feel-bigger | مدموج | الملفان المعدلان فقط: المقالة و`data/editorial_progress.md`. 9 روابط فعلية متطابقة بين الفرع و`main`، وقيم `img src/alt` متطابقة. حُل تعارض التتبع بدمج تغييرات `main` في الفرع مع الاحتفاظ بصفوف المقالات الـ17، ثم دُمج PR وحدّث الصف إلى `done`. | مكتمل؛ لا تعديلات يدوية على المقالة. |

## ملاحظات تشغيلية

- لم تُدمج PRs #34 و#38 و#39 و#41 خلال هذا التدقيق.
- لا تُعتبر #38 و#39 و#41 جاهزة للدمج ما دامت `mergeable=false`.
- لا تُخلط PRs #42–#48 الخاصة بالـSVG مع مجموعة Claude غير المحددة؛ لم تُخترع أرقام PRs بديلة.
