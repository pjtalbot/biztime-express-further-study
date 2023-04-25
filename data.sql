\c biztime

DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS industries CASCADE;
DROP TABLE IF EXISTS companies_industries CASCADE;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries (
  code text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text
);

CREATE TABLE companies_industries (
  company_code TEXT NOT NULL,
  industry_code TEXT NOT NULL,
  CONSTRAINT companies_industries_pk PRIMARY KEY (company_code, industry_code),
  CONSTRAINT FK_companies FOREIGN KEY (company_code) REFERENCES companies (code)
  ON DELETE CASCADE,
  CONSTRAINT FK_category FOREIGN KEY (industry_code) REFERENCES industries (code) ON DELETE CASCADE

);



INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industries 
  VALUES ('tech', 'Technology', 'Beep Boop');


INSERT INTO companies_industries (
  VALUES ('apple', 'tech')
);
