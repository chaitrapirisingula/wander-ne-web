import { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { sites_db } from "../Data/Firebase";

/** Loads `2026_sponsors` from Realtime Database (city + link per chamber). */
export function useChamberSponsors() {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snapshot = await get(ref(sites_db, "2026_sponsors"));
        if (cancelled || !snapshot.exists()) return;
        const list = [];
        snapshot.forEach((child) => {
          const v = child.val();
          if (v && typeof v === "object") {
            list.push({ ...v, id: child.key });
          }
        });
        setSponsors(list);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return sponsors;
}
