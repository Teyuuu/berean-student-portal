import React, { useState, useEffect } from 'react';
import { api } from '@/lib/supabase';
import {
  Program,
  Curriculum,
  CurriculumSubject,
  Subject,
  YearLevel,
  Semester,
} from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import {
  BookOpen,
  Plus,
  Trash2,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const CurriculumBuilderPage: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<string>('');
  const [curriculumSubjects, setCurriculumSubjects] = useState<CurriculumSubject[]>([]);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [yearLevels, setYearLevels] = useState<YearLevel[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialogs
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [isNewCurriculumModalOpen, setIsNewCurriculumModalOpen] = useState(false);

  // Add Subject Form
  const [targetYearLevelId, setTargetYearLevelId] = useState('');
  const [targetSemesterId, setTargetSemesterId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedPrerequisiteId, setSelectedPrerequisiteId] = useState('');
  const [isRequired, setIsRequired] = useState(true);

  // New Curriculum Form
  const [newProgramId, setNewProgramId] = useState('');
  const [newCurriculumName, setNewCurriculumName] = useState('');
  const [newVersion, setNewVersion] = useState('');
  const [newEffectiveYear, setNewEffectiveYear] = useState('2026-2027');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedCurriculumId) {
      loadCurriculumSubjects(selectedCurriculumId);
    }
  }, [selectedCurriculumId]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [progs, currs, subs, yls, sems] = await Promise.all([
        api.getPrograms(),
        api.getCurricula(),
        api.getSubjects(),
        api.getYearLevels(),
        api.getSemesters(),
      ]);

      setPrograms(progs);
      setCurricula(currs);
      setAllSubjects(subs);
      setYearLevels(yls);
      setSemesters(sems);

      if (currs.length > 0) {
        setSelectedCurriculumId(currs[0].id);
      }
      if (yls.length > 0) setTargetYearLevelId(yls[0].id);
      if (sems.length > 0) setTargetSemesterId(sems[0].id);
      if (subs.length > 0) setSelectedSubjectId(subs[0].id);
      if (progs.length > 0) setNewProgramId(progs[0].id);
    } finally {
      setLoading(false);
    }
  };

  const loadCurriculumSubjects = async (currId: string) => {
    const list = await api.getCurriculumSubjects(currId);
    setCurriculumSubjects(list);
  };

  const handleCreateCurriculum = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await api.createCurriculum({
      program_id: newProgramId,
      name: newCurriculumName,
      version: newVersion,
      effective_academic_year: newEffectiveYear,
      status: 'ACTIVE',
    });

    const refreshed = await api.getCurricula();
    setCurricula(refreshed);
    setSelectedCurriculumId(created.id);
    setIsNewCurriculumModalOpen(false);
  };

  const handleAddSubjectToCurriculum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCurriculumId || !selectedSubjectId || !targetYearLevelId || !targetSemesterId) return;

    // Check duplicate
    const exists = curriculumSubjects.some((cs) => cs.subject_id === selectedSubjectId);
    if (exists) {
      alert('This subject is already included in this curriculum.');
      return;
    }

    await api.addCurriculumSubject({
      curriculum_id: selectedCurriculumId,
      subject_id: selectedSubjectId,
      year_level_id: targetYearLevelId,
      semester_id: targetSemesterId,
      prerequisite_subject_id: selectedPrerequisiteId || null,
      is_required: isRequired,
      status: 'ACTIVE',
    });

    await loadCurriculumSubjects(selectedCurriculumId);
    setIsAddSubjectModalOpen(false);
  };

  const handleRemoveSubject = async (id: string) => {
    if (confirm('Are you sure you want to remove this subject from this curriculum?')) {
      await api.removeCurriculumSubject(id);
      await loadCurriculumSubjects(selectedCurriculumId);
    }
  };

  const activeCurriculum = curricula.find((c) => c.id === selectedCurriculumId);
  const totalCurriculumUnits = curriculumSubjects.reduce(
    (acc, cs) => acc + (cs.subject?.units || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">
            Curriculum Builder
          </h1>
          <p className="text-sm text-slate-500">
            Design and version theological course programs, semester pathways, and prerequisites
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setIsNewCurriculumModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            New Curriculum Version
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSelectedPrerequisiteId('');
              setIsAddSubjectModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Subject to Pathway
          </Button>
        </div>
      </div>

      {/* Curriculum Selector Card */}
      <Card className="bg-slate-900 text-white border-slate-800 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Active Curriculum Blueprint
            </div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              {activeCurriculum?.name || 'Select Curriculum'}
              <Badge variant="gold" className="ml-2 text-xs">
                Version {activeCurriculum?.version}
              </Badge>
            </div>
            <div className="text-xs text-slate-300">
              Program: {activeCurriculum?.program?.name} • Effective: {activeCurriculum?.effective_academic_year}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs text-slate-400">Total Program Load</div>
              <div className="text-2xl font-bold text-amber-400">
                {totalCurriculumUnits}{' '}
                <span className="text-xs font-normal text-slate-300">units</span>
              </div>
            </div>

            <div className="w-56">
              <label className="text-[10px] text-slate-400 block uppercase mb-1">
                Select Curriculum
              </label>
              <Select
                value={selectedCurriculumId}
                onChange={(e) => setSelectedCurriculumId(e.target.value)}
                className="bg-slate-800 text-white border-slate-700 text-xs h-9"
              >
                {curricula.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.program?.code} — {c.name} (v{c.version})
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Tree Visualization by Year Level & Semester */}
      <div className="space-y-6">
        {yearLevels.map((yl) => {
          const subjectsInYear = curriculumSubjects.filter((cs) => cs.year_level_id === yl.id);
          const yearTotalUnits = subjectsInYear.reduce((acc, cs) => acc + (cs.subject?.units || 0), 0);

          return (
            <Card key={yl.id} className="overflow-hidden border-slate-200">
              {/* Year Header */}
              <div className="bg-blue-950 text-white px-5 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-sm">{yl.name}</span>
                </div>
                <div className="text-xs text-blue-200">
                  {subjectsInYear.length} Courses •{' '}
                  <span className="font-bold text-amber-300">{yearTotalUnits} Units</span>
                </div>
              </div>

              {/* Semesters in Year */}
              <CardContent className="p-5 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {semesters.slice(0, 2).map((sem) => {
                    const termSubjects = subjectsInYear.filter((cs) => cs.semester_id === sem.id);
                    const semUnits = termSubjects.reduce(
                      (acc, cs) => acc + (cs.subject?.units || 0),
                      0
                    );

                    return (
                      <div
                        key={sem.id}
                        className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <span className="font-semibold text-xs text-slate-800 uppercase tracking-wide">
                            {sem.name}
                          </span>
                          <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {semUnits} units
                          </span>
                        </div>

                        {termSubjects.length === 0 ? (
                          <div className="py-6 text-center text-xs text-slate-400 italic">
                            No subjects mapped to this semester yet.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {termSubjects.map((cs) => (
                              <div
                                key={cs.id}
                                className="bg-white p-3 rounded-md border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex items-start justify-between gap-2"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-mono text-xs font-bold text-blue-900">
                                      {cs.subject?.code}
                                    </span>
                                    <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                                      {cs.subject?.units} units
                                    </Badge>
                                    {cs.is_required ? (
                                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 rounded">
                                        Required
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 rounded">
                                        Elective
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs font-medium text-slate-800">
                                    {cs.subject?.name}
                                  </div>
                                  {cs.prerequisite_subject && (
                                    <div className="text-[11px] text-amber-700 flex items-center">
                                      <span className="font-semibold mr-1">Prerequisite:</span>
                                      {cs.prerequisite_subject.code} — {cs.prerequisite_subject.name}
                                    </div>
                                  )}
                                </div>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveSubject(cs.id)}
                                  className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-7 w-7"
                                  title="Remove subject"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setTargetYearLevelId(yl.id);
                            setTargetSemesterId(sem.id);
                            setSelectedPrerequisiteId('');
                            setIsAddSubjectModalOpen(true);
                          }}
                          className="w-full text-xs text-blue-900 hover:bg-blue-50 border border-dashed border-slate-300"
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" />
                          Add Subject to {sem.name}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal: Add Subject to Curriculum */}
      <Dialog
        open={isAddSubjectModalOpen}
        onOpenChange={setIsAddSubjectModalOpen}
        title="Add Subject to Curriculum Pathway"
        description="Select subject code, pathway semester, and prerequisites."
      >
        <form onSubmit={handleAddSubjectToCurriculum} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Select Subject *
            </label>
            <Select
              required
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
            >
              {allSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} — {s.name} ({s.units} units)
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Year Level *
              </label>
              <Select
                value={targetYearLevelId}
                onChange={(e) => setTargetYearLevelId(e.target.value)}
              >
                {yearLevels.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Semester *
              </label>
              <Select
                value={targetSemesterId}
                onChange={(e) => setTargetSemesterId(e.target.value)}
              >
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Prerequisite Subject (Optional)
            </label>
            <Select
              value={selectedPrerequisiteId}
              onChange={(e) => setSelectedPrerequisiteId(e.target.value)}
            >
              <option value="">None (No prerequisite required)</option>
              {allSubjects
                .filter((s) => s.id !== selectedSubjectId)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} — {s.name}
                  </option>
                ))}
            </Select>
            <p className="text-[11px] text-slate-500 mt-1">
              Students cannot enroll in this subject until passing the prerequisite course.
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="isRequiredCheck"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
            />
            <label htmlFor="isRequiredCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
              Mark as Required core subject (Uncheck for elective)
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsAddSubjectModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add to Curriculum</Button>
          </div>
        </form>
      </Dialog>

      {/* Modal: New Curriculum Version */}
      <Dialog
        open={isNewCurriculumModalOpen}
        onOpenChange={setIsNewCurriculumModalOpen}
        title="Create New Curriculum Version"
        description="Versioned curricula guarantee historical students keep their cohort requirements without modifications."
      >
        <form onSubmit={handleCreateCurriculum} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Degree Program *
            </label>
            <Select
              required
              value={newProgramId}
              onChange={(e) => setNewProgramId(e.target.value)}
            >
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Curriculum Name *
            </label>
            <Input
              required
              placeholder="e.g. Bachelor of Theology Curriculum 2027"
              value={newCurriculumName}
              onChange={(e) => setNewCurriculumName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Version Code *
              </label>
              <Input
                required
                placeholder="e.g. 2027.1"
                value={newVersion}
                onChange={(e) => setNewVersion(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Effective Academic Year *
              </label>
              <Input
                required
                placeholder="e.g. 2027-2028"
                value={newEffectiveYear}
                onChange={(e) => setNewEffectiveYear(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsNewCurriculumModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Curriculum</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
