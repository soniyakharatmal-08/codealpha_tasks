function LanguageSelect({ id, label, value, onChange, languages, allowAuto = false }) {
  const visibleLanguages = allowAuto ? languages : languages.filter((language) => language.code !== 'auto');

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {visibleLanguages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelect;
