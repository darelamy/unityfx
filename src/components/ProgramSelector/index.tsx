"use client";

import React from "react";
import styles from "./ProgramSelector.module.scss";
import { PlusIcon } from "@/icons/PlusIcon";
import { AfterEffectsIcon } from "@/icons/AfterEffectsIcon";
import { PremiereProIcon } from "@/icons/PremiereProIcon";
import { MovaviIcon } from "@/icons/MovaviIcon";
import { VegasProIcon } from "@/icons/VegasProIcon";
import { DaVinciResolveIcon } from "@/icons/DaVinciResolveIcon";
import { AttachIcon } from "@/icons/AttachIcon";
import { GreenCheckMarkIcon } from "@/icons/GreenCheckMarkIcon";
import { AnimatePresence, motion } from "framer-motion";

interface ProgramSelectorProps {}

interface IProgram {
  id: number;
  name: string;
  icon: React.ReactNode;
}

const ProgramSelector: React.FC<ProgramSelectorProps> = ({}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedPrograms, setSelectedPrograms] = React.useState<IProgram[]>(
    [],
  );

  const programs = [
    { id: 1, name: "After Effects", icon: <AfterEffectsIcon /> },
    { id: 2, name: "Premiere Pro", icon: <PremiereProIcon /> },
    { id: 3, name: "Movavi", icon: <MovaviIcon /> },
    { id: 4, name: "Vegas Pro", icon: <VegasProIcon /> },
    { id: 5, name: "Da Vinci Resolve", icon: <DaVinciResolveIcon /> },
  ];

  const toggleProgram = (program: IProgram) => {
    setIsOpen(false);

    if (
      selectedPrograms.some(
        (selectedProgram) => selectedProgram.id === program.id,
      )
    ) {
      setSelectedPrograms(
        selectedPrograms.filter(
          (selectedProgram) => selectedProgram.id !== program.id,
        ),
      );
    } else {
      setSelectedPrograms([...selectedPrograms, program]);
    }
  };
  console.log(isOpen);
  return (
    <div className={styles.programSelector}>
      <div>
        {isOpen && (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              initial={{ opacity: 0, x: -400, scale: 0.5 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 200, scale: 1.2 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <div className={`${styles.programIcons} flex gap-5`}>
                {programs.map((program) => (
                  <div className="relative" key={program.id}>
                    <div onClick={() => toggleProgram(program)}>
                      {program.icon}
                    </div>
                    {selectedPrograms.some(
                      (selectedProgram) => selectedProgram.id === program.id,
                    ) && (
                      <div className={styles.programAddedIcon}>
                        <GreenCheckMarkIcon />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        <div
          className={`${styles.selectedProgramList} flex items-center gap-3`}
        >
          {selectedPrograms.length !== 0 && (
            <div>
              <AnimatePresence mode="popLayout">
                <div className="flex items-center gap-3">
                  {selectedPrograms.map((program) => (
                    <motion.div
                      key={program.id}
                      layout
                      initial={{ opacity: 0, x: -400, scale: 0.5 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 200, scale: 1.2 }}
                      transition={{ duration: 0.6, type: "spring" }}
                    >
                      {program.icon}
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </div>
          )}
          <button type="button" onClick={() => setIsOpen(true)}>
            <PlusIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgramSelector;
