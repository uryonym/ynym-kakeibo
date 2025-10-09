import sys
from pathlib import Path

# Ensure backend (project root for backend package) is on sys.path so `import src` works
ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
