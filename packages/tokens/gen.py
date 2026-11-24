# Talus token generator. Writes the token JSON in src/ and CONTRAST.md. Run inside packages/tokens.
# Writes W3C design token (DTCG) JSON and CONTRAST.md. Run: python3 gen.py
import json, os, shutil
P = {
 "granite": {"50":"#F6F6F4","100":"#ECECE8","200":"#D9D8D2","300":"#BDBBB3","400":"#9A978D","500":"#74716A","600":"#5F5C54","700":"#4A4842","800":"#34332F","900":"#22211F","950":"#151513"},
 "spruce":  {"50":"#EEF5F3","100":"#D3E7E1","200":"#A8CFC3","300":"#74B09F","400":"#43907B","500":"#237563","600":"#1A5E50","700":"#154C41","800":"#113B33","900":"#0C2A25"},
 "clay":    {"50":"#FBF3EE","100":"#F5E1D4","200":"#EBC2A8","300":"#DE9C76","400":"#CF774A","500":"#B85A2E","600":"#9A4723","700":"#7B381D","800":"#5C2B17","900":"#3F1E11"},
 "aspen":   {"50":"#FDF8E7","100":"#FAEDC0","200":"#F4D97F","300":"#EBC23F","400":"#D9A514","500":"#B3870C","600":"#8C690A","700":"#6B5009","800":"#4D3A07","900":"#332605"},
 "sky":     {"50":"#EEF5FB","100":"#D6E7F5","200":"#ADCFEB","300":"#7BB1DD","400":"#4A90CB","500":"#2B73B0","600":"#215C8E","700":"#1B4A72","800":"#153956","900":"#0F283C"},
 "lichen":  {"50":"#F0F6EA","100":"#DBEACB","200":"#B8D59A","300":"#92BD67","400":"#6EA23F","500":"#55862B","600":"#436A22","700":"#35531B","800":"#273D14","900":"#1A290E"},
 "ember":   {"50":"#FCEFEE","100":"#F8D7D4","200":"#F0AFA9","300":"#E5817A","400":"#D8574F","500":"#BF3B33","600":"#9E2F28","700":"#7F2621","800":"#5E1D19","900":"#3F1411"},
 "dusk":    {"50":"#F3F0F8","100":"#E2DBEE","200":"#C6B8DD","300":"#A592C9","400":"#8770B4","500":"#6E569C","600":"#58457D","700":"#45365F","800":"#322743","900":"#211A2C"},
 "base":    {"white":"#FFFFFF","bone":"#FAF7F2","ink":"#151513","black":"#000000"},
 "alpha":   {"ink-8":"#15151314","ink-12":"#1515131F","ink-20":"#15151333","ink-48":"#1515137A","black-32":"#00000052","black-48":"#0000007A","black-64":"#000000A3","white-8":"#FFFFFF14"},
}
def hexof(r):
    fam,step=r.split("."); return P[fam][step]

# ---------- Color modes ----------
light_common = {
 "text.primary":"granite.900","text.secondary":"granite.600","text.placeholder":"granite.500","text.disabled":"granite.400",
 "text.inverse":"base.white","text.on-action":"base.white","text.on-highlight":"granite.900",
 "icon.default":"granite.700","icon.secondary":"granite.500","icon.on-action":"base.white",
 "bg.surface":"base.white","bg.raised":"base.white","bg.subtle":"granite.100","bg.hover":"granite.100","bg.inverse":"granite.900","bg.disabled":"granite.100",
 "bg.overlay":"alpha.ink-48",
 "border.default":"granite.300","border.strong":"granite.500","border.input":"granite.500","border.disabled":"granite.200",
 "action.secondary.bg":"base.white","action.secondary.text":"granite.900",
 "action.ghost.bg-hover":"granite.100","action.ghost.text":"granite.900",
 "action.danger.bg":"ember.600","action.danger.bg-hover":"ember.700",
 "status.success.fg":"lichen.700","status.success.bg":"lichen.50","status.success.border":"lichen.500",
 "status.warning.fg":"aspen.800","status.warning.bg":"aspen.50","status.warning.border":"aspen.500",
 "status.danger.fg":"ember.700","status.danger.bg":"ember.50","status.danger.border":"ember.500",
 "status.info.fg":"sky.700","status.info.bg":"sky.50","status.info.border":"sky.500",
 "status.neutral.fg":"granite.700","status.neutral.bg":"granite.100","status.neutral.border":"granite.400",
 "chart.1":"sky.600","chart.2":"aspen.600","chart.3":"spruce.400","chart.4":"lichen.600","chart.5":"clay.500","chart.6":"dusk.500",
 "chart.grid":"granite.200","chart.axis":"granite.600",
 "shadow.ambient":"alpha.ink-8","shadow.key":"alpha.ink-12",
}
modes = {
 "enterprise-light": dict(light_common, **{
   "bg.canvas":"granite.50",
   "action.primary.bg":"spruce.600","action.primary.bg-hover":"spruce.700","action.primary.bg-pressed":"spruce.800",
   "action.secondary.bg-hover":"granite.100","action.secondary.border":"granite.500",
   "text.link":"spruce.700","text.brand":"spruce.700",
   "bg.brand-subtle":"spruce.50","bg.selected":"spruce.50","border.selected":"spruce.600","bg.highlight":"aspen.100",
   "border.focus":"sky.600",
 }),
 "enterprise-dark": {
   "text.primary":"granite.50","text.secondary":"granite.300","text.placeholder":"granite.400","text.disabled":"granite.500",
   "text.inverse":"granite.900","text.on-action":"granite.950","text.on-highlight":"granite.50",
   "icon.default":"granite.200","icon.secondary":"granite.400","icon.on-action":"granite.950",
   "bg.canvas":"granite.950","bg.surface":"granite.900","bg.raised":"granite.800","bg.subtle":"granite.800","bg.hover":"granite.800","bg.inverse":"granite.50","bg.disabled":"granite.800",
   "bg.overlay":"alpha.black-64",
   "border.default":"granite.700","border.strong":"granite.500","border.input":"granite.400","border.disabled":"granite.800",
   "action.primary.bg":"spruce.300","action.primary.bg-hover":"spruce.200","action.primary.bg-pressed":"spruce.100",
   "action.secondary.bg":"granite.900","action.secondary.bg-hover":"granite.800","action.secondary.border":"granite.400","action.secondary.text":"granite.50",
   "action.ghost.bg-hover":"granite.800","action.ghost.text":"granite.50",
   "action.danger.bg":"ember.300","action.danger.bg-hover":"ember.200",
   "text.link":"spruce.300","text.brand":"spruce.300",
   "bg.brand-subtle":"spruce.900","bg.selected":"spruce.900","border.selected":"spruce.300","bg.highlight":"aspen.800",
   "border.focus":"sky.300",
   "status.success.fg":"lichen.200","status.success.bg":"lichen.900","status.success.border":"lichen.400",
   "status.warning.fg":"aspen.200","status.warning.bg":"aspen.900","status.warning.border":"aspen.400",
   "status.danger.fg":"ember.200","status.danger.bg":"ember.900","status.danger.border":"ember.400",
   "status.info.fg":"sky.200","status.info.bg":"sky.900","status.info.border":"sky.400",
   "status.neutral.fg":"granite.200","status.neutral.bg":"granite.800","status.neutral.border":"granite.500",
   "chart.1":"sky.300","chart.2":"aspen.300","chart.3":"spruce.300","chart.4":"lichen.300","chart.5":"clay.300","chart.6":"dusk.300",
   "chart.grid":"granite.700","chart.axis":"granite.300",
   "shadow.ambient":"alpha.black-32","shadow.key":"alpha.black-48",
 },
 "consumer-light": dict(light_common, **{
   "bg.canvas":"base.white",
   "action.primary.bg":"granite.900","action.primary.bg-hover":"granite.700","action.primary.bg-pressed":"granite.950",
   "action.secondary.bg-hover":"aspen.50","action.secondary.border":"granite.900",
   "action.ghost.bg-hover":"aspen.50",
   "text.link":"granite.900","text.brand":"granite.900",
   "bg.brand-subtle":"aspen.50","bg.selected":"aspen.50","border.selected":"granite.900","bg.highlight":"aspen.300",
   "border.input":"granite.900",
   "border.focus":"sky.600",
 }),
}
keys = set(modes["enterprise-light"])
for m in modes.values(): assert set(m)==keys, set(m)^keys

def lum(h):
    h=h.lstrip("#")[:6]; c=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    c=[x/12.92 if x<=0.03928 else ((x+0.055)/1.055)**2.4 for x in c]
    return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]
def cr(a,b):
    la,lb=lum(a),lum(b); return (max(la,lb)+0.05)/(min(la,lb)+0.05)
T,N=4.5,3.0
pairs=[("text.primary","bg.canvas",T),("text.primary","bg.surface",T),("text.primary","bg.raised",T),("text.primary","bg.subtle",T),("text.primary","bg.selected",T),("text.primary","bg.hover",T),
 ("text.secondary","bg.surface",T),("text.secondary","bg.canvas",T),("text.secondary","bg.subtle",T),("text.placeholder","bg.surface",T),
 ("text.link","bg.surface",T),("text.link","bg.canvas",T),("text.brand","bg.brand-subtle",T),
 ("text.on-action","action.primary.bg",T),("text.on-action","action.primary.bg-hover",T),("text.on-action","action.primary.bg-pressed",T),("text.on-action","action.danger.bg",T),("text.on-action","action.danger.bg-hover",T),
 ("action.secondary.text","action.secondary.bg",T),("action.secondary.text","action.secondary.bg-hover",T),("action.ghost.text","action.ghost.bg-hover",T),
 ("text.on-highlight","bg.highlight",T),("text.inverse","bg.inverse",T),
 ("status.success.fg","status.success.bg",T),("status.warning.fg","status.warning.bg",T),("status.danger.fg","status.danger.bg",T),("status.info.fg","status.info.bg",T),("status.neutral.fg","status.neutral.bg",T),
 ("icon.default","bg.surface",N),("icon.secondary","bg.surface",N),("icon.on-action","action.primary.bg",N),
 ("border.input","bg.surface",N),("border.strong","bg.surface",N),("border.focus","bg.surface",N),("border.focus","bg.canvas",N),("border.focus","bg.raised",N),
 ("border.selected","bg.surface",N),("action.primary.bg","bg.surface",N),("action.primary.bg","bg.canvas",N),("action.secondary.border","bg.surface",N),
 ("chart.1","bg.surface",N),("chart.2","bg.surface",N),("chart.3","bg.surface",N),("chart.4","bg.surface",N),("chart.5","bg.surface",N),("chart.6","bg.surface",N),("chart.axis","bg.surface",T)]
report=[]; fails=[]
for t,m in modes.items():
    for f,b,mn in pairs:
        r=cr(hexof(m[f]),hexof(m[b])); good=r>=mn
        row=f"| {t} | {f} on {b} | {hexof(m[f])} / {hexof(m[b])} | {r:.2f} | {mn} | {'pass' if good else 'FAIL'} |"
        report.append(row)
        if not good: fails.append(row)
print("\n".join(fails) or f"all {len(report)} pass")

def nest(d):
    out={}
    for k,v in d.items():
        parts=k.split("."); cur=out
        for p in parts[:-1]: cur=cur.setdefault(p,{})
        cur[parts[-1]]=v
    return out
D=lambda v:{"$type":"dimension","$value":v}
shutil.rmtree("tokens",ignore_errors=True)
for d in ("src/brand","src/color"): os.makedirs(d,exist_ok=True)

prim={"$description":"Talus primitives. Raw values only. Products never use these directly; they use brand, color and global tokens.",
 "color":{fam:{s:{"$type":"color","$value":v} for s,v in steps.items()} for fam,steps in P.items()},
 "space":{k:D(f"{v}px") for k,v in {"0":0,"1":4,"2":8,"3":12,"4":16,"5":20,"6":24,"8":32,"10":40,"12":48,"16":64,"20":80}.items()},
 "radius":{k:D(f"{v}px") for k,v in {"none":0,"xs":2,"sm":4,"md":6,"lg":10,"full":9999}.items()},
 "font":{"family":{
     "plex-sans":{"$type":"fontFamily","$value":["IBM Plex Sans","system-ui","sans-serif"]},
     "plex-mono":{"$type":"fontFamily","$value":["IBM Plex Mono","ui-monospace","monospace"]},
     "archivo":{"$type":"fontFamily","$value":["Archivo","system-ui","sans-serif"]}},
   "weight":{k:{"$type":"fontWeight","$value":v} for k,v in {"regular":400,"medium":500,"semibold":600,"bold":700,"extrabold":800}.items()},
   "size":{k:D(f"{v}px") for k,v in {"12":12,"13":13,"14":14,"16":16,"18":18,"20":20,"24":24,"28":28,"32":32,"40":40,"48":48,"56":56}.items()},
   "line-height":{k:{"$type":"number","$value":v} for k,v in {"tight":1.15,"snug":1.3,"normal":1.5}.items()}},
 "duration":{k:{"$type":"duration","$value":v} for k,v in {"fast":"120ms","base":"200ms","slow":"320ms"}.items()},
}
json.dump(prim,open("src/primitives.json","w"),indent=2)

glob={"$description":"Talus global tokens. Same in every brand and color mode.",
 "easing":{"standard":{"$type":"cubicBezier","$value":[0.2,0,0,1]},"enter":{"$type":"cubicBezier","$value":[0,0,0,1]},"exit":{"$type":"cubicBezier","$value":[0.3,0,1,1]}},
 "motion":{"$description":"Durations drop to 0ms under prefers-reduced-motion.","duration":{k:{"$type":"duration","$value":"{duration."+k+"}"} for k in ("fast","base","slow")}},
 "z":{k:{"$type":"number","$value":v} for k,v in {"base":0,"sticky":100,"dropdown":200,"overlay":300,"modal":400,"popover":500,"toast":600}.items()},
 "breakpoint":{k:D(f"{v}px") for k,v in {"compact":480,"medium":768,"wide":1080,"full":1440}.items()},
 "size":{"icon":{k:D(f"{v}px") for k,v in {"sm":16,"md":20,"lg":24}.items()},"touch-min":D("24px")},
 "elevation":{
   "1":{"$type":"shadow","$description":"Cards that lift on hover, sticky headers","$value":[{"color":"{color.shadow.ambient}","offsetX":"0px","offsetY":"1px","blur":"2px","spread":"0px"}]},
   "2":{"$type":"shadow","$description":"Menus, popovers, select lists","$value":[{"color":"{color.shadow.ambient}","offsetX":"0px","offsetY":"2px","blur":"4px","spread":"0px"},{"color":"{color.shadow.key}","offsetX":"0px","offsetY":"6px","blur":"16px","spread":"-4px"}]},
   "3":{"$type":"shadow","$description":"Dialogs and drawers","$value":[{"color":"{color.shadow.ambient}","offsetX":"0px","offsetY":"4px","blur":"8px","spread":"0px"},{"color":"{color.shadow.key}","offsetX":"0px","offsetY":"16px","blur":"40px","spread":"-8px"}]}},
}
json.dump(glob,open("src/global.json","w"),indent=2)

shape={
 "enterprise":{"radius.control":"{radius.sm}","radius.container":"{radius.md}","control.height.sm":"28px","control.height.md":"32px","control.height.lg":"40px","density.row":"36px","border.width.control":"1px",
   "font.family.display":"{font.family.plex-sans}","font.family.body":"{font.family.plex-sans}","font.family.mono":"{font.family.plex-mono}","font.weight.display":"{font.weight.semibold}",
   "font.size.display":"{font.size.32}","font.size.h1":"{font.size.28}","font.size.h2":"{font.size.20}","font.size.h3":"{font.size.16}","font.size.body":"{font.size.14}","font.size.body-sm":"{font.size.13}","font.size.label":"{font.size.13}","font.size.caption":"{font.size.12}"},
 "consumer":{"radius.control":"{radius.xs}","radius.container":"{radius.sm}","control.height.sm":"36px","control.height.md":"44px","control.height.lg":"52px","density.row":"56px","border.width.control":"2px",
   "font.family.display":"{font.family.archivo}","font.family.body":"{font.family.plex-sans}","font.family.mono":"{font.family.plex-mono}","font.weight.display":"{font.weight.extrabold}",
   "font.size.display":"{font.size.56}","font.size.h1":"{font.size.40}","font.size.h2":"{font.size.28}","font.size.h3":"{font.size.20}","font.size.body":"{font.size.16}","font.size.body-sm":"{font.size.14}","font.size.label":"{font.size.14}","font.size.caption":"{font.size.13}"},
}
typ=lambda k: "fontFamily" if "family" in k else "fontWeight" if "weight" in k else "dimension"
for b,s in shape.items():
    d={k:{"$type":typ(k),"$value":v} for k,v in s.items()}
    d["focus.ring-width"]=D("2px"); d["focus.ring-offset"]=D("2px")
    json.dump({"$description":f"Talus {b} brand: type, size, density and shape. Pairs with a color mode.",**nest(d)},open(f"src/brand/{b}.json","w"),indent=2)
for t,m in modes.items():
    sem={"color":nest({k:{"$type":"color","$value":"{color."+v+"}"} for k,v in sorted(m.items())})}
    json.dump({"$description":f"Talus color mode {t}. Same keys in every color mode.",**sem},open(f"src/color/{t}.json","w"),indent=2)

comp={"$description":"Talus component tokens. They alias brand, color and global tokens only.",
 "button":{"height":D("{control.height.md}"),"radius":D("{radius.control}"),"padding-x":D("{space.4}"),"gap":D("{space.2}"),"border-width":D("{border.width.control}")},
 "input":{"height":D("{control.height.md}"),"radius":D("{radius.control}"),"border-width":D("{border.width.control}"),"padding-x":D("{space.3}")},
 "card":{"radius":D("{radius.container}"),"padding":D("{space.4}")},
 "table":{"row-height":D("{density.row}")},
 "dialog":{"radius":D("{radius.container}"),"padding":D("{space.6}"),"shadow":{"$type":"shadow","$value":"{elevation.3}"}},
 "menu":{"radius":D("{radius.container}"),"shadow":{"$type":"shadow","$value":"{elevation.2}"}},
}
json.dump(comp,open("src/components.json","w"),indent=2)
open("CONTRAST.md","w").write("# Talus contrast check\n\nWCAG 2.1 AA: text pairs need 4.5:1 (1.4.3); icons, borders, focus rings, control edges and chart marks need 3:1 (1.4.11). Chart colors: the order (sky, aspen, spruce, lichen, clay, dusk) keeps the first four apart under the two common red-green color-vision types; charts with five or six series must label lines and bars directly. Generated by gen.py; rerun after any color change.\n\n| Mode | Pair | Colors | Ratio | Needs | Result |\n|---|---|---|---|---|---|\n"+"\n".join(report)+"\n")
