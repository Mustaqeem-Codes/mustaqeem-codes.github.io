# About Section Responsive Plan

**Status:** Planning - Awaiting approval

**Current Issues:**
- Fixed 30%/70% widths break on mobile
- Large paddings (40px 50px) cause overflow
- stack-row 90% width too wide
- No mobile breakpoints
- Icon grid needs tighter spacing

**Plan:**
1. Add @media (max-width: 992px): Stack panels vertically, full width, reduce padding
2. @media (max-width: 768px): Smaller fonts, icon size 35px, 2-column wrap
3. Scale uet-card: max-width:90%, height:auto
4. Fix linter errors from previous edit (syntax/whitespace)

**Dependent Files:**
- styles/About Me.css (add media queries)

**Follow-up:**
- Test with browser resize
- Update TODO.md

Approve to proceed?

