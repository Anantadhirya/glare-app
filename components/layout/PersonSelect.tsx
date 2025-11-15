"use client";

import { useState, useEffect } from "react";
import { PersonSimple } from "../types/person";
import { get_simple_person_list, create_new_person } from "./actions";

interface PersonSelectProps {
  value: string; // selected person ID
  onSelect: (personId: string, personName: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function PersonSelect({
  value,
  onSelect,
  placeholder = "Search or create new person...",
  disabled = false,
}: PersonSelectProps) {
  const [persons, setPersons] = useState<PersonSimple[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchPersons();
  }, []);

  useEffect(() => {
    // Set initial search value based on selected person
    if (value && persons.length > 0) {
      const selectedPerson = persons.find((p) => p.id === value);
      if (selectedPerson) {
        setSearchValue(selectedPerson.name);
      }
    }
  }, [value, persons]);

  const fetchPersons = async () => {
    try {
      const data = await get_simple_person_list();
      setPersons(data);
    } catch (err) {
      console.error("Failed to fetch persons:", err);
    }
  };

  const filteredPersons = persons.filter((p) =>
    p.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const isNewPerson =
    searchValue.trim() &&
    !filteredPersons.some(
      (p) => p.name.toLowerCase() === searchValue.trim().toLowerCase()
    );

  const handlePersonClick = (person: PersonSimple) => {
    setSearchValue(person.name);
    onSelect(person.id, person.name);
    setShowDropdown(false);
    setActiveIndex(0);
  };

  const handleCreateNew = async () => {
    if (!searchValue.trim()) return;

    try {
      setIsLoading(true);
      const newPerson = await create_new_person(searchValue.trim());
      setPersons([...persons, newPerson]);
      setSearchValue(newPerson.name);
      onSelect(newPerson.id, newPerson.name);
      setShowDropdown(false);
      setActiveIndex(0);
    } catch (err) {
      alert("Failed to create person");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setShowDropdown(true);
        setActiveIndex(0);
        e.preventDefault();
      }
      return;
    }

    const totalOptions =
      filteredPersons.length > 0 ? filteredPersons.length : isNewPerson ? 1 : 0;

    if (totalOptions === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < totalOptions - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < filteredPersons.length) {
          handlePersonClick(filteredPersons[activeIndex]);
        } else if (
          activeIndex === 0 &&
          isNewPerson &&
          filteredPersons.length === 0
        ) {
          handleCreateNew();
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowDropdown(false);
        setActiveIndex(0);
        break;
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          onSelect("", ""); // Clear selection when typing
          setShowDropdown(true);
          setActiveIndex(0);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowDropdown(true)}
        onBlur={() =>
          setTimeout(() => {
            setShowDropdown(false);
            setActiveIndex(0);
          }, 200)
        }
        disabled={disabled || isLoading}
        className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder={placeholder}
      />
      {showDropdown && (searchValue.trim() || filteredPersons.length > 0) && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredPersons.length > 0 ? (
            filteredPersons.map((person, index) => (
              <button
                key={person.id}
                onClick={() => handlePersonClick(person)}
                className={`w-full px-4 py-2 text-left transition-colors flex items-center justify-between ${
                  index === activeIndex
                    ? "bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100"
                    : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100"
                }`}
              >
                <span>{person.name}</span>
                {index === activeIndex && (
                  <kbd className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700">
                    ↵
                  </kbd>
                )}
              </button>
            ))
          ) : isNewPerson ? (
            <button
              onClick={handleCreateNew}
              disabled={isLoading}
              className={`w-full px-4 py-2 text-left transition-colors disabled:opacity-50 ${
                activeIndex === 0
                  ? "bg-blue-200 dark:bg-blue-800/50 text-blue-900 dark:text-blue-100"
                  : "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>
                    {isLoading ? (
                      "Creating..."
                    ) : (
                      <>
                        Create new person: <strong>{searchValue.trim()}</strong>
                      </>
                    )}
                  </span>
                </div>
                {activeIndex === 0 && (
                  <kbd className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-300 dark:bg-blue-700 text-blue-900 dark:text-blue-100 border border-blue-400 dark:border-blue-600">
                    ↵
                  </kbd>
                )}
              </div>
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
