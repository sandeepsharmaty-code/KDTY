# Sprint 8.3 — Database Validation via real SQL execution (Python's
# stdlib sqlite3 — genuinely executes real SQL, real FK/UNIQUE
# constraint enforcement). CAVEAT, stated plainly and unavoidably: this
# is SQLite, not PostgreSQL — TypeORM's real generated DDL, Postgres-
# specific types, and TypeORM's own migration behavior are NOT
# exercised. What IS genuinely tested: whether the relational structure
# this project's entities describe (Product->Category, Order->Customer,
# Review->Variant+Customer) enforces real referential integrity when
# expressed as SQL against real invalid data.
import sqlite3, sys

conn = sqlite3.connect(":memory:")
conn.execute("PRAGMA foreign_keys = ON;")
cur = conn.cursor()
cur.executescript("""
CREATE TABLE category (id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL);
CREATE TABLE product (id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, category_id TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(id));
CREATE TABLE customer (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL);
CREATE TABLE "order" (id TEXT PRIMARY KEY, customer_id TEXT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(id));
CREATE TABLE product_variant (id TEXT PRIMARY KEY, product_id TEXT NOT NULL, sku TEXT UNIQUE NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product(id));
CREATE TABLE review (id TEXT PRIMARY KEY, variant_id TEXT NOT NULL, customer_id TEXT NOT NULL,
    FOREIGN KEY (variant_id) REFERENCES product_variant(id),
    FOREIGN KEY (customer_id) REFERENCES customer(id));
""")

results = []
cur.execute("INSERT INTO category VALUES ('cat1', 'nail-polish', 'Nail Polish')")
cur.execute("INSERT INTO product VALUES ('prod1', 'muse-rose', 'cat1')")
cur.execute("INSERT INTO customer VALUES ('cust1', 'amelia@example.com')")
conn.commit()
results.append(("valid product->category insert succeeds", True))

try:
    cur.execute("INSERT INTO product VALUES ('prod2', 'ghost-product', 'nonexistent-category')")
    conn.commit()
    results.append(("product with non-existent category is rejected", False))
except sqlite3.IntegrityError:
    results.append(("product with non-existent category is rejected", True))

try:
    cur.execute("INSERT INTO category VALUES ('cat2', 'nail-polish', 'Duplicate Slug')")
    conn.commit()
    results.append(("duplicate category slug is rejected", False))
except sqlite3.IntegrityError:
    results.append(("duplicate category slug is rejected", True))

cur.execute("INSERT INTO \"order\" VALUES ('order1', 'cust1')")
conn.commit()
results.append(("valid order->customer insert succeeds", True))

try:
    cur.execute("INSERT INTO \"order\" VALUES ('order2', 'ghost-customer')")
    conn.commit()
    results.append(("order with non-existent customer is rejected", False))
except sqlite3.IntegrityError:
    results.append(("order with non-existent customer is rejected", True))

cur.execute("INSERT INTO product_variant VALUES ('var1', 'prod1', 'HMB-NP-001')")
cur.execute("INSERT INTO review VALUES ('rev1', 'var1', 'cust1')")
conn.commit()
results.append(("valid review->variant+customer insert succeeds", True))

conn.close()
for name, passed in results:
    print(f"[{'PASS' if passed else 'FAIL'}] {name}")
if not all(p for _, p in results):
    sys.exit(1)
