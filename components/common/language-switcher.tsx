import { setLocale } from "@/actions/locale.actions";

export function LanguageSwitcher() {
  return (
    <form action={setLocale} className="flex gap-2 text-sm">
      <button
        name="locale"
        value="en"
        className="rounded-md border bg-white px-3 py-1 text-black"
      >
        EN
      </button>

      <button
        name="locale"
        value="ru"
        className="rounded-md border bg-white px-3 py-1 text-black"
      >
        RU
      </button>
    </form>
  );
}