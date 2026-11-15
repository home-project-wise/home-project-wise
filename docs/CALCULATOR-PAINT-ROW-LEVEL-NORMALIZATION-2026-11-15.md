# Paint evidence row-level normalization — 2026-11-15

**Owner:** ChatGPT — research and data quality  
**Purpose:** Convert the source sweep into a row-level evidence table and identify which values can be compared without silently mixing unlike measurements.  
**Status:** Evidence normalized; country-level defaults are not yet approved.

## Normalization conventions

- 1 US liquid gallon = 3.785411784 L.
- 1 sq ft = 0.09290304 m².
- For a stated US-gallon coverage C, normalized rate = C × 0.09290304 ÷ 3.785411784 (m²/L).
- For a stated metric pack volume V, normalized rate = stated covered area ÷ V (m²/L).
- For a stated consumption q in ml/m², equivalent rate = 1000 ÷ q (m²/L), but retain the original consumption value and note whether it is per coat.
- Do not convert “two-coat system” yield into a per-coat figure unless the source gives equal per-coat consumption or the derived value is explicitly labelled arithmetic only.
- “Up to” is an upper bound, not a typical practical value. “Theoretical” and “practical” are separate bases. A product's H10 hiding class is retained alongside the spreading rate at which it was measured.

## Row-level evidence

### US

| Manufacturer / product | Source | Raw statement | Normalized value | Basis / limitations | Review |
|---|---|---:|---:|---|---|
| BEHR MARQUEE Interior Matte | https://www.behr.com/pro/products/interior-products/interior-paints-and-coatings/paints-and-coatings/behr-marquee-interior/behr-marquee-matte | 250–400 sq ft/US gal | 6.14–9.82 m²/L | Depends on application method and substrate porosity; spray loss excluded; 4.0 mil wet / 1.8 mil dry in product TDS; one-coat guarantee has explicit exclusions | Keep, basis is substrate-dependent |
| PPG SPEEDHIDE Interior Latex Flat, 6-70 | https://buyat.ppg.com/rep_pafpainttools_files/Pghpaints/TDB/6-70.PDF | approx. 400 sq ft/US gal | 9.82 m²/L | Smooth, nonporous surfaces; 4 mil wet / 1.3 mil dry; surface irregularity/porosity and application losses excluded; second coat where necessary; TDS 10/2024 | Keep, smooth-surface benchmark |
| Benjamin Moore ben® Interior Matte | https://media.benjaminmoore.com/WebServices/prod/assets/production/sellsheets/ben_Interior_SellSheet_US.pdf | 400–450 sq ft/US gal | 9.82–11.05 m²/L | Theoretical gallon coverage at recommended film thickness; recommended coats 1 or 2 | Keep as theoretical, not practical |
| Sherwin-Williams Duration Home semi-gloss | https://sherlink.sherwin.com/sher-link/ViewHearsCountryCodeDoc?language=E&sku=651315822&type=DP | 350–400 sq ft/US gal | 8.59–9.82 m²/L | Semi-gloss, not flat/matt; excluded from standard matte cohort | Exclude from matte range |

**US conclusion:** Three independent manufacturers provide useful data, but the bases are not identical. BEHR gives substrate-dependent coverage, PPG gives a smooth/nonporous flat benchmark, and Benjamin Moore explicitly calls its figure theoretical. The resulting 6.14–11.05 m²/L is a source envelope only, not a single practical rate.

### Canada

| Manufacturer / product | Source | Raw statement | Normalized value | Basis / limitations | Review |
|---|---|---:|---:|---|---|
| BEHR MARQUEE Interior Matte | https://images.homedepot.ca/pdf/BEHR%20MARQUEE%20INTERIOR%20MATTE%20PAINT_TDS_Canada-pdf.pdf | up to 37 m²/3.78 L | up to 9.79 m²/L | Depending on method and substrate porosity; 102 μm wet / 46 μm dry; roller nap specified; spray loss excluded | Keep as max |
| Benjamin Moore ben® Interior Matte | https://www.benjaminmoore.com/en-ca/product/ben-interior-paint-matte-3-78-l-galaxy-2117-20/F624/ZWB100000002077560 | 37.2–41.8 m²/3.78 L | 9.84–11.06 m²/L | Product page lists 1 or 2 coats; volume solids 38%; wet/dry film thickness given; application by brush/roll/spray | Keep; exact TDS linked on page |
| Valspar Accolade Interior Paint + Primer | https://www.valspar.ca/en/products/interior-paints-primers/accolade-interior-paint-primer | 37 m²/3.78 L | 9.79 m²/L | One-coat claim subject to colour and surface conditions; product-specific | Keep as product-specific |
| SICO Expert | https://buyat.ppg.com/REP_PafPaintTools_files/Sico/SC_8746XX_CAEN.pdf | 45–51 m²/3.78 L per coat | 11.90–13.49 m²/L per coat | Product/finish-specific; do not treat as a generic wall-paint rate | Keep only if finish and TDS version match the target cohort |
| Dulux Canada Flat Interior | https://buyat.ppg.com/REP_PafPaintTools_files/Dulux/GN_945000_CAEN.pdf | approx. 37 m²/3.78 L | 9.79 m²/L | Primed, smooth, nonporous surfaces; practical coverage; application loss and additional coats for porous surfaces/colour changes excluded | Keep, verify corporate/brand relationship before counting independent manufacturer |
| Cloverdale PremiumClassic Flat, 03123 | https://superiorcoatings.ca/wp-content/uploads/2019/05/cloverdale-tds-03123-flat.pdf | 350–450 sq ft/gal | 8.59–11.05 m²/L | Theoretical per coat; TDS printed 2015-08-25 / version 2015 | Historical only; exclude from current default until replaced by current TDS |

**Canada conclusion:** There are multiple product records, but the SICO high-end rate is a different product/finish basis and the Cloverdale sheet is old. Do not count Dulux and PPG as independent manufacturers without checking corporate ownership. No single Canadian default is approved.

### GB

| Manufacturer / product | Source | Raw statement | Normalized value | Basis / limitations | Review |
|---|---|---:|---:|---|---|
| Crown Standard Emulsion Matt | https://cd01.crownpaints.co.uk/products/standard-emulsion/matt/beige-white/136 | 14 m²/L; recommended 2 coats | 14 m²/L | Water-based matt, walls/ceilings, brush/roller; bare/porous plaster needs a diluted mist coat; some colours need more coats | Keep, consumer product |
| HMG Vinyl Matt Emulsion | https://shop.hmgpaint.com/wp-content/uploads/2024/10/HMG-Vinyl-Matt-Emulsion-120924.pdf | 15 m²/L | 15 m²/L | Version 1, 8 Oct 2024; 1–2 coats; matt; interior walls/ceilings; prepared substrates; not suitable over lime plaster | Keep, product-specific |
| Crown Trade Matt Vinyl | https://professional.crownpaints.com/content/uploads/product-sync-resources/qLpFdovwwTGqdh8d.pdf | up to 17 m²/L | up to 17 m²/L | Trade flat matt; smooth surfaces; technical sheet gives product-specific spreading rate; not standard consumer matt | Keep as trade cohort only |
| Dulux Trade Supermatt | https://www.duluxtradepaintexpert.co.uk/en/products/dulux-trade-supermatt/cccId_410174 | up to 18 m²/L | up to 18 m²/L | High-opacity trade matt, especially new plaster; “up to” maximum; surface sealing/dilution instructions apply | Keep as separate trade cohort, not consumer default |

**GB conclusion:** The 14–15 m²/L consumer-matt figures and 17–18 m²/L trade/high-opacity upper limits should not be pooled. The standard-matt cohort currently has two strong independent sources; a third current consumer-matt TDS is still desirable.

### DE

| Manufacturer / product | Source | Raw statement | Normalized value | Basis / limitations | Review |
|---|---|---:|---:|---|---|
| StoColor Select DIN | https://www.sto.de/webdocs/productdocuments/TechnicalDataSheet_StoColor_Select_DIN_0101_DE_01_00.PDF | EN 13300 yield 6.5 m²/L; consumption 0.12–0.14 L/m² per coat | 6.5 m²/L H10 class 2; consumption equivalent 7.14–8.33 m²/L | G4 dull matt; 2 coats 0.24–0.28 L/m²; consumption depends on substrate/application/consistency; revision 27 Feb 2025 | Keep both distinct figures; do not collapse |
| Brillux Raulan 953 | https://www.brillux.de/produkte/638384_raulan-953 | 130–150 ml/m² per coat; H10 class 1 at 7 m²/L (white), 8 m²/L (trend white) | 6.67–7.69 m²/L consumption equivalent; H10 7–8 m²/L | G4 matt; product-specific hiding class and colour-base difference | Keep |
| Alpina Innenraum-Weiß | https://alpina-farben.de/fileadmin/InterfaceAssets/assets/pdf/TI_2136_Alpina_Innenraum-Weiss_KH.pdf | H10 class 2 at 6 m²/L | 6 m²/L | Manufacturer says high opacity may often allow one coat; product-specific; technical sheet approx. 2023 | Keep as EN 13300-linked |
| Caparol Innenfarben catalogue | https://www.caparol.de/caparol_pim_import/caparol_de/broschueren/pdfs/302733_CAP-25150_BRO_Innenfarben.pdf | 6 m²/L guideline | 6 m²/L | Several matt interior product lines; manufacturer says indicative and substrate-dependent; catalogue source | Keep as product family guide, not one SKU |

**DE conclusion:** This is the strongest EN 13300-linked market sample. Still, H10 class and the test rate must remain attached. The 6.5 m²/L H10 class 2 and 7 m²/L H10 class 1 are not equivalent performance statements.

### FR

| Manufacturer / product | Source | Raw statement | Normalized value | Basis / limitations | Review |
|---|---|---:|---:|---|---|
| StoColor In | https://www.sto.fr/webdocs/productdocuments/TechnicalDataSheet_StoColor_In_0207_FR_01_02.PDF | 6.5 m²/L | 6.5 m²/L | Ultra matt interior dispersion; EN 13300 H10 class 1; revision 21 Apr 2026 | Keep |
| Colorine ColorTex Mat | https://www.colorine.fr/img/cms/M5/fiches-techniques/ColorTexMat.pdf | 6–8 m²/L | 6–8 m²/L | Acrylic matt interior walls/ceilings; TDS May 2024; full sheet substrate/application details need rechecking | Keep, conditional |
| Seigneurie Evolutex 2en1 Mat | https://www.seigneuriegauthier.com/peintures/peintures-interieures/peintures-murs-plafonds/evolutex-2en1-mat | 9–11 m²/L smooth; 7–9 m²/L painting canvas | As stated | Product page calculator explicitly assumes 2 coats; bare wall may need primer; substrate-specific | Keep as separate substrate/product case |
| Seigneurie Alkyneo Mat | https://www.seigneuriegauthier.com/peintures/peintures-interieures/peintures-murs-plafonds/alkyneo-mat | 10–12 m²/L smooth | As stated | Different alkyd/acrylic emulsion formulation; do not pool without classification | Keep as separate product family |

**FR conclusion:** Three manufacturers exist, but the spread is wide and substrate/product formulations differ. No single rate is yet comparable enough for an automatic default.

### ES

| Manufacturer / product | Source | Raw statement | Normalized value | Basis / limitations | Review |
|---|---|---:|---:|---|---|
| Valpaint L-3000 | https://media.adeo.com/media/4819910/media.pdf | 9–10 m²/L per coat at 100 μm wet film | 9–10 m²/L | Acrylic matt interior wall/ceiling paint; TDS revision Dec 2024 | Keep |
| Grupo Puma Pumacril Interior | https://www.grupopuma.com/es-ES/productos/ver/pumacril-interior-es-es | theoretical 7–9 m²/L | 7–9 m²/L | UNE 48282; first/subsequent coat dilution differs; theoretical rate | Keep as theoretical |
| Caparol CapaColor | https://www.caparol.es/productos/productos-por-categorias/pinturas-de-interior-y-exterior/pinturas-de-interior/pinturas-esenciales/capacolor | 10–12 m²/L per coat | 10–12 m²/L | Substrate absorption/texture and colour change affect yield; some colour changes need special first coat and two finish coats | Keep |
| Isaval Bianco Mate Básico | https://www.isaval.es/productos/bianco_-mate-basico/ | 8–10 m²/L | 8–10 m²/L | Absorbent or poor-condition surfaces require primer | Keep, product basis needs TDS check |
| Juno Junoprof | https://www.juno.es/productos/pintura/interiores/sistema-tintometrico/ficha/junoprof/ | 10–12 m²/L per coat | 10–12 m²/L | Matt; coverage class 2; dilution differs for first vs subsequent coats | Keep |

**ES conclusion:** Adequate candidate sample size; theoretical and per-coat data still need separate subgroups.

### IT

| Manufacturer / product | Source | Raw statement | Normalized value | Basis / limitations | Review |
|---|---|---:|---:|---|---|
| Caparol InnenColor | https://www.caparol.it/fileadmin/data_it/Materiali_Informativi_PDF/CICLI_TECNICI_Pitture_per_Interni.pdf | 8–11 m²/L per coat | 8–11 m²/L | Second coat after 4h; primer selected by substrate; source brochure/flyer evidence | Keep, obtain current product TDS |
| Boero Magnum Muri Opaco | https://www.boero.it/wp-content/uploads/2025/04/scheda-tecnica-magnum-muri-opaco-cod-139-smalto-murale-opaco-all-acqua-boero.pdf | practical 10–12 m²/L per coat | 10–12 m²/L | Depends on absorption; two finish coats; new/weakly chalking surfaces require primer; TDS Apr 2025 | Keep |
| San Marco Pittura per Interni | https://static.san-marco.com/new/SMG/Allegati/Novacolor/Pittura%20per%20Interni/Scheda%20tecnica%20html/IT_N150_pittura-per-interni.html | 3–5 m²/L over two coats | 3–5 m²/L per complete two-coat system | Support type/absorption dependent; preliminary test advised; TDS revision 16 May 2025 | Keep as system rate; do not convert to per-coat claim |
| San Marco Novalux I | https://static.san-marco.com/new/SMG/Allegati/Novacolor/Novalux%20I/Scheda%20tecnica%20html/IT_N158_novalux-i.html | 4–5 m²/L over two coats | 4–5 m²/L per complete two-coat system | White/light colours; substrate absorption dependent; TDS revision 16 May 2025 | Keep as system rate |

**IT conclusion:** A two-coat system rate is directly available from San Marco; do not convert it to a per-coat rate unless the manufacturer confirms equal material use per coat.

### NL

| Manufacturer / product | Source | Raw statement | Normalized value | Basis / limitations | Review |
|---|---|---:|---:|---|---|
| Wijzonol Muurverf Mat | https://www.wijzonol.nl/wp-content/uploads/wpallimport/files/documents/10093_nl_PIB_Wijzonol_Bouwverven_B.V._Wijzonol%20Muurverf%20Mat_1_1_1762319041007.pdf | theoretical and practical roller 7–9 m²/L per coat | 7–9 m²/L | Practical rate depends on porosity/structure; trial patch advised; PIB v1.1 | Keep, strongest practical data |
| Stiho Muurverf | https://www.stiho.nl/INTERSHOP/web/WFS/stihoGroep-Stiho-Site/nl_NL/-/EUR/ViewProductAttachment-OpenFile?DirectoryPath=&FileName=Stiho+Muurverf+20102021+v2.pdf&LocaleId=nl_NL&UnitName=stihoGroep-Stiho | theoretical 8–9 m²/L at 40 μm dry | 8–9 m²/L | H10/contrast class 1 at 8 m²/L; 2021 product sheet | Keep as theoretical |
| Sikkens Binnenmuurverf Mat | https://msp.images.akzonobel.com/prd/dh/enlexp/documents/65/b3/c0/5f/sikkens_binnenmuurverf.pdf | approx. 11 m²/L | 11 m²/L | Matt water-based; brush/roller; dependent on method, roughness, structure and porosity; TDS dated 27 Feb 2025; primer recommended for professional finish | Keep |

**NL conclusion:** Three manufacturers now have identifiable sources. Practical and theoretical figures remain separate; Sikkens is a stated approximate rate with substrate dependence.

## Cross-market release decision

The source sample is large enough to establish that a useful quantity range is feasible in every market. It is **not** yet sufficient to publish one blended “typical practical coverage” number per country because:
- some values are theoretical, others practical, maximum or a two-coat system;
- the European H10 hiding classes differ and must be paired with their test spreading rate;
- trade/high-opacity and consumer matt products are not identical;
- substrate condition and primer system change total consumption.

A dependable beginner implementation can use one of two paths:

1. **Source-envelope path:** calculate a broad, visibly labelled two-coat finish-paint range from the full market sample, retaining every source basis and explaining that actual coverage varies. This is useful but must not be described as a statistically representative national market rate.
2. **Strict practical path:** restrict the default to sources with practical roller yield on a defined sound, prepared surface. Where fewer than three independent comparable manufacturers remain, show no automatic paint quantity estimate in that market and retain manual refinement.

The owner should choose the intended balance between a broad useful range and a narrower but more often unavailable strict practical estimate before the first values are enabled. The price/cost layer remains separate: no paint price range is approved by this evidence.

## Current next actions

- Recheck current TDS links/revision dates for UK Crown Standard Matt, French Colorine and Italian Caparol; classify all values as per-coat/system and practical/theoretical/maximum.
- Confirm PPG/SICO/Dulux corporate relationship before counting manufacturer independence in Canada.
- Decide whether the first release uses the source-envelope path or strict practical path.
- Do not create generic paint-cost ranges from these coverage sources; retail price research and product-class matching are a separate task.
- No calculator code, CSS, price registry, assumptions registry, workflow or deployment changed by this document.
