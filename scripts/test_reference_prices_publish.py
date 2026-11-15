"""Byte-identity and failure tests for scripts/rebuild_site_indexes.py::publish_reference_prices.
Run: python3 scripts/test_reference_prices_publish.py"""
import importlib.util, json, shutil, tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("rebuild_site_indexes", HERE / "rebuild_site_indexes.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

def sandbox():
    root = Path(tempfile.mkdtemp())
    (root / "data").mkdir()
    (root / "website").mkdir()
    return root

def expect_exit(root, text):
    try:
        mod.publish_reference_prices(root)
    except SystemExit as exc:
        assert text in str(exc), str(exc)
        assert not (root / "website" / "reference-prices.json").exists()
        return
    raise AssertionError("expected SystemExit: " + text)

# 1. the copy is byte-identical to the canonical registry
real = HERE.parent / "data" / "reference_prices.json"
root = sandbox()
shutil.copyfile(real, root / "data" / "reference_prices.json")
out = mod.publish_reference_prices(root)
assert out == root / "website" / "reference-prices.json"
assert out.read_bytes() == real.read_bytes()
print("PASS published copy is byte-identical to data/reference_prices.json")

# 2. missing, invalid or empty registry stops the build and publishes nothing
expect_exit(sandbox(), "missing")
bad = sandbox(); (bad / "data" / "reference_prices.json").write_text("{not json", encoding="utf-8"); expect_exit(bad, "not valid JSON")
empty = sandbox(); (empty / "data" / "reference_prices.json").write_text("[]", encoding="utf-8"); expect_exit(empty, "non-empty list")
print("PASS missing, invalid and empty registries are refused")

# 3. the build calls it first, and the website copy is never hand-maintained
src = (HERE / "rebuild_site_indexes.py").read_text(encoding="utf-8")
assert "def main():\n    publish_reference_prices()" in src
print("PASS main() publishes the registry before anything else")
# 4. the assumptions registry is published the same way: byte-identical, and refused when missing, invalid or without an approval block
real_a = HERE.parent / "data" / "reference_assumptions.json"
root_a = sandbox(); shutil.copyfile(real_a, root_a / "data" / "reference_assumptions.json")
out_a = mod.publish_reference_assumptions(root_a)
assert out_a == root_a / "website" / "reference-assumptions.json" and out_a.read_bytes() == real_a.read_bytes()
def expect_exit_a(root, text):
    try:
        mod.publish_reference_assumptions(root)
    except SystemExit as exc:
        assert text in str(exc), str(exc)
        assert not (root / "website" / "reference-assumptions.json").exists()
        return
    raise AssertionError("expected SystemExit: " + text)
expect_exit_a(sandbox(), "missing")
bad_a = sandbox(); (bad_a / "data" / "reference_assumptions.json").write_text("{not json", encoding="utf-8"); expect_exit_a(bad_a, "not valid JSON")
noapp = sandbox(); (noapp / "data" / "reference_assumptions.json").write_text(json.dumps({"records": [{"id": "x"}]}), encoding="utf-8"); expect_exit_a(noapp, "approval block")
assert "publish_reference_prices()\n    publish_reference_assumptions()" in src
print("PASS assumptions registry is published byte-for-byte and refused when missing, invalid or unapproved")
print("3 publish tests passed")
