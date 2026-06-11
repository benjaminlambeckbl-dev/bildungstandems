# -*- coding: utf-8 -*-
"""Erzeugt docs/Berechtigungsmatrix.xlsx (Coachingspace-Look)."""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# ---- Farben ----
NAVY = "1D1F4E"; NAVY_LT = "E9EAF3"
F = {
    "v": ("Verwalten", "70AD79", "FFFFFF"),   # dunkelgrün
    "n": ("Nutzen",     "C6EFCE", "1C2230"),   # hellgrün
    "l": ("Lesen",      "DDEBF7", "1C2230"),   # hellblau
    "x": ("—",          "F2F2F2", "8A97A5"),   # grau
    "p": ("perspekt.",  "FDE9CE", "8a5a00"),   # orange (Schüler später)
}
thin = Side(style="thin", color="D9DEE6")
BORDER = Border(left=thin, right=thin, top=thin, bottom=thin)
ROLES = ["Admin (ZSB)", "Trainer:in (ZSB)", "Koordination (Schule)", "Schüler:in (perspekt.)"]

def cell(key, scope=None):
    txt, _, _ = F[key]
    if scope:
        txt = f"{txt}\n({scope})"
    return (txt, key)

# (Feature, [4x (key) oder (key,scope)])
SECTIONS = [
    ("1 · Lernen & Inhalte", [
        ("Materialien ansehen / nutzen (Suche, Tags)", ["v","n","n","p"]),
        ("Inhalte/Materialien pflegen (CMS)",          ["v","n","l","x"]),
        ("Zeitgesteuerte Freischaltung steuern",       ["v","n","x","x"]),
        ("Schuljahres-Phasen/Struktur pflegen",        ["v","n","l","x"]),
        ("FAQ nutzen (Selbsthilfe)",                   ["n","n","n","p"]),
        ("FAQ pflegen",                                ["v","n","x","x"]),
        ("Onboarding durchlaufen",                     ["x","n","n","p"]),
    ]),
    ("2 · Kommunikation / Chat", [
        ("Schulgruppen-Chat",            ["v","n","n","p"]),
        ("Partnerschulgruppen-Chat",     ["v","n","n","p"]),
        ("Frei definierbare Gruppen",    ["v","n","l","x"]),
        ("Direktnachrichten",            ["v","n","n","p"]),
        ("Wichtige Nachricht „Sticky“",  ["v","n","n","x"]),
    ]),
    ("3 · Organisation – Termine & Kalender", [
        ("Termine ansehen",            [("v","alle"),("n","betreute"),("n","Schule"),("p","eigene")]),
        ("Termine anlegen/verwalten",  [("v",None),("n","global/Training"),("n","Schule"),("p","vorschlagen")]),
        ("Kalender (persönlich/schul/global)", ["v","n","n","p"]),
        ("Terminabstimmung",           ["v","n","n","p"]),
        ("Erinnerungen erhalten (Push/E-Mail)", ["n","n","n","p"]),
    ]),
    ("4 · Feedback & Monitoring", [
        ("Feedback geben („Wie lief es?“)",   ["x","x","n","p"]),
        ("Bedarfsmeldung („Hilfe nötig?“)",   ["x","x","n","p"]),
        ("Auswertung/Diagramme sehen",        [("v","alle"),("n","betreute"),("n","Schule"),"x"]),
    ]),
    ("5 · Formulare", [
        ("Formulare ausfüllen",                 ["n","n","n","p"]),
        ("Formulare zuweisen / Status verwalten", [("v",None),("n","betreute"),("n","Schule"),"x"]),
    ]),
    ("6 · Benutzer- & Rollenverwaltung", [
        ("Schulen anlegen",            ["v","x","x","x"]),
        ("Nutzer einladen/zuweisen",   [("v",None),("n","betreute"),("n","eigene Schule"),"x"]),
        ("Trainer zuweisen",           ["v","x","x","x"]),
        ("Jahreswechsel-Logik",        ["v","x","x","x"]),
        ("Rollen-/Rechteverwaltung",   ["v","x","x","x"]),
    ]),
]

wb = Workbook()
ws = wb.active
ws.title = "Berechtigungsmatrix"
ws.sheet_view.showGridLines = False

def put(r, c, val, *, bold=False, fill=None, font_color="1C2230", size=10,
        align="left", wrap=False, border=False):
    cl = ws.cell(row=r, column=c, value=val)
    cl.font = Font(name="Calibri", size=size, bold=bold, color=font_color)
    cl.alignment = Alignment(horizontal=align, vertical="center", wrap_text=wrap)
    if fill:
        cl.fill = PatternFill("solid", fgColor=fill)
    if border:
        cl.border = BORDER
    return cl

# Titel
put(1, 1, "Berechtigungsmatrix – BildungsTandems / ZSB", bold=True, size=15, font_color=NAVY)
put(2, 1, "Rollen × Features (Lastenheft) · Coachingspace GmbH", size=9, font_color="5C6B7A")
# Legende
put(3, 1, "Legende:", bold=True, size=9, font_color=NAVY)
legend_keys = ["v","n","l","x","p"]
for i, k in enumerate(legend_keys):
    txt, bg, fc = F[k]
    put(3, 2 + i, txt.replace("\n"," "), fill=bg, font_color=fc, align="center", size=9, border=True, bold=True)

HEAD = 5  # Kopfzeile
put(HEAD, 1, "Feature", bold=True, fill=NAVY, font_color="FFFFFF", align="left", border=True)
for j, role in enumerate(ROLES):
    put(HEAD, 2 + j, role, bold=True, fill=NAVY, font_color="FFFFFF", align="center", wrap=True, border=True)

r = HEAD + 1
for sec_title, rows in SECTIONS:
    put(r, 1, sec_title, bold=True, fill=NAVY_LT, font_color=NAVY, border=True)
    for j in range(len(ROLES)):
        put(r, 2 + j, "", fill=NAVY_LT, border=True)
    r += 1
    for feat, cells in rows:
        put(r, 1, feat, border=True, wrap=True)
        for j, spec in enumerate(cells):
            if isinstance(spec, tuple):
                key, scope = spec
            else:
                key, scope = spec, None
            txt, bg, fc = F[key]
            disp = txt if not scope else f"{txt}\n({scope})"
            put(r, 2 + j, disp, fill=bg, font_color=fc, align="center", wrap=True, border=True, bold=(key=="v"))
        r += 1

# Hinweise
r += 1
notes = [
    "Geltungsbereich: Admin = systemweit · Trainer = betreute Schulen · Koordination = eigene Schule (serverseitig per RLS).",
    "Schüler:in = laut Lastenheft „perspektivisch“ (im Prototyp bereits als Coach umgesetzt). Koordination ≈ Lehrkraft. Trainer-Rolle im Prototyp noch nicht abgebildet (Admin deckt ZSB ab).",
    "Schüler-Chat: startet keine Erwachsenen-Gespräche, darf aber antworten; Lehrkraft↔Schüler-Chats für die Koordination einsehbar (Kinderschutz).",
]
for n in notes:
    put(r, 1, n, size=8, font_color="5C6B7A", wrap=True)
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
    r += 1

# Spaltenbreiten / Freeze
ws.column_dimensions["A"].width = 42
for j in range(len(ROLES)):
    ws.column_dimensions[get_column_letter(2 + j)].width = 22
ws.freeze_panes = "B6"
ws.row_dimensions[HEAD].height = 30

# ---- Blatt 2: Direktchat ----
ws2 = wb.create_sheet("Direktchat")
ws2.sheet_view.showGridLines = False
put2 = lambda *a, **k: None
def cput(ws, r, c, val, *, bold=False, fill=None, fc="1C2230", size=10, align="center", wrap=False, border=False):
    cl = ws.cell(row=r, column=c, value=val)
    cl.font = Font(name="Calibri", size=size, bold=bold, color=fc)
    cl.alignment = Alignment(horizontal=align, vertical="center", wrap_text=wrap)
    if fill: cl.fill = PatternFill("solid", fgColor=fill)
    if border: cl.border = BORDER

cput(ws2, 1, 1, "Direktchat – wer darf wen anschreiben?", bold=True, size=14, fc=NAVY, align="left")
cput(ws2, 2, 1, "ja = darf initiieren · — = nein · eingeschränkt = nur antworten / perspektivisch", size=9, fc="5C6B7A", align="left")
GREEN=("ja","C6EFCE","1C2230"); GREY=("—","F2F2F2","8A97A5"); ORANGE=("eingeschr.","FDE9CE","8a5a00"); SELF=("–","E9EAF3","8A97A5")
roles_s = ["Admin","Trainer","Koordination","Schüler:in"]
H=4
cput(ws2, H, 1, "Initiator ↓ \\ Empfänger →", bold=True, fill=NAVY, fc="FFFFFF", align="left", border=True, wrap=True)
for j,role in enumerate(roles_s):
    cput(ws2, H, 2+j, role, bold=True, fill=NAVY, fc="FFFFFF", border=True, wrap=True)
chat = {
    "Admin":        ["self","ja","ja","ja"],
    "Trainer":      ["ja","ja","ja","nein"],
    "Koordination": ["ja","ja","ja","ja"],
    "Schüler:in":   ["nein","nein","eingeschr","perspekt"],
}
M={"ja":GREEN,"nein":GREY,"self":SELF,"eingeschr":ORANGE,"perspekt":ORANGE}
for i,role in enumerate(roles_s):
    rr=H+1+i
    cput(ws2, rr, 1, role, bold=True, fill=NAVY_LT, fc=NAVY, align="left", border=True)
    for j,code in enumerate(chat[role]):
        if code=="eingeschr": disp="nur antworten"
        elif code=="perspekt": disp="perspekt."
        else: disp=M[code][0]
        _,bg,fc=M[code]
        cput(ws2, rr, 2+j, disp, fill=bg, fc=fc, border=True, wrap=True)
ws2.column_dimensions["A"].width = 26
for j in range(len(roles_s)):
    ws2.column_dimensions[get_column_letter(2+j)].width = 18
ws2.row_dimensions[H].height = 28

wb.save("docs/Berechtigungsmatrix.xlsx")
print("xlsx erstellt")
