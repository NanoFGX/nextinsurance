# Test credentials / demo data — NEXTINSURANCE

This app has **no login / authentication system**. Users are identified by an
anonymous `uid` stored in localStorage (created during onboarding via the
profile store). No email/password accounts exist.

## Demo payment behavior (`POST /api/purchase`)
- **Card (success):** any cardholder name + a card number of 12+ digits NOT ending in `0000`
  (e.g. `4111 1111 1111 1111`). Returns an active policy.
- **Card (decline):** any card number ending in `0000` (e.g. `4111 1111 1111 0000`) → HTTP 402 decline.
- **FPX:** pick any bank from the FPX list.
- **E-wallet:** pick any wallet from the list.

## Notes for testing
- Policies are stored **in-memory** per server process; they reset on restart and
  do not persist across Vercel serverless invocations.
- AI advisor in the Emergent preview uses the real Emergent universal key (Claude);
  response header `x-advisor-mode: claude`.
