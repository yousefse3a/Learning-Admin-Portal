import { useEffect, useState } from "react";
import FormController from "./FormController";
import { Skills } from "@/api/adminApis";
import { Control, FieldErrors } from "react-hook-form";
import { ExamData } from "./AddExamTypes";
import { useLevelSearch } from "@/hooks/usseLevelsSearch";
import { useGradeSearch } from "@/hooks/useGradesSearch";
import { useSubjectSearch } from "@/hooks/useSubjectSearch";

function GeneralInfo({
  control,
  errors,
}: {
  control: Control<ExamData>;
  errors: FieldErrors<ExamData>;
}) {
  const { grades, isLoading: gradesLoading } = useGradeSearch();
  const { subjects, isLoading: subjectsLoading } = useSubjectSearch();
  const { levels, isLoading: levelsLoading } = useLevelSearch();

  const skillOptions = Object.entries(Skills)
    .filter(([_key, value]) => typeof value === "number")
    .map(([key, value]) => ({ value: value.toString(), label: key }));

  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      <FormController
        label="Name (Arabic)"
        name="NameAr"
        control={control}
        placeholder="Exam Name Arabic"
        errors={errors}
        type="text"
      />
      <FormController
        label="Name (English)"
        name="NameEn"
        control={control}
        placeholder="Exam Name English"
        errors={errors}
        type="text"
      />
      <FormController
        label="Skill"
        name="Skill"
        control={control}
        placeholder="Skill"
        errors={errors}
        type="select"
        options={skillOptions}
      />
      <FormController
        label="Subject"
        name="SubjectId"
        control={control}
        placeholder="Subject"
        errors={errors}
        type="select"
        options={subjects.map((sub) => ({ value: sub.Id, label: sub.NameEn }))}
        isLoading={subjectsLoading}
      />
      <FormController
        label="Grade"
        name="GradeId"
        control={control}
        placeholder="Select Grade"
        errors={errors}
        type="select"
        options={grades.map((grad) => ({ value: grad.Id, label: grad.NameEn }))}
        isLoading={gradesLoading}
      />
      <FormController
        label="Level"
        name="LevelId"
        control={control}
        placeholder="Level"
        errors={errors}
        type="select"
        options={levels.map((level) => ({
          value: level.Id,
          label: level.NameEn,
        }))}
        isLoading={levelsLoading}
      />
      <FormController
        label="Number of Mandatory Questions"
        name="NumberOfMandatoryQuestions"
        control={control}
        placeholder="Enter Number"
        errors={errors}
        type="number"
      />
      <FormController
        label="Active"
        name="IsActive"
        control={control}
        placeholder="Active"
        errors={errors}
        type="checkbox"
      />
    </div>
  );
}

export default GeneralInfo;
