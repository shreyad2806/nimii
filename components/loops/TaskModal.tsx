"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle2, Sparkles } from "lucide-react";
import { OpenLoopItem } from "@/lib/data/mockData";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<OpenLoopItem, "id" | "completed" | "createdAt">) => void;
  initialTask?: OpenLoopItem | null;
}

export function TaskModal({
  isOpen,
  onClose,
  onSave,
  initialTask,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<OpenLoopItem["category"]>("Project");
  const [timeframe, setTimeframe] = useState<OpenLoopItem["timeframe"]>("today");
  const [dueDate, setDueDate] = useState("Today");
  const [priority, setPriority] = useState<OpenLoopItem["priority"]>("Medium");

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setCategory(initialTask.category);
      setTimeframe(initialTask.timeframe);
      setDueDate(initialTask.dueDate);
      setPriority(initialTask.priority);
    } else {
      setTitle("");
      setDescription("");
      setCategory("Project");
      setTimeframe("today");
      setDueDate("Today");
      setPriority("Medium");
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      timeframe,
      dueDate: dueDate.trim() || "Today",
      priority,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white shadow-2xl space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F1EFF8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-[#6C5CE7]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#1E1B4B]">
              {initialTask ? "Edit Open Loop" : "Create New Open Loop"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#7C7F96] hover:bg-[#F3F0FF] hover:text-[#1E1B4B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1E1B4B] mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Finish Mandate project UI"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#F8F6FC] border border-[#DDD6FE] text-sm text-[#1E1B4B] placeholder-[#94A3B8] outline-none focus:ring-2 focus:ring-[#6C5CE7]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E1B4B] mb-1">
              Description / Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key context, links or checklist items..."
              className="w-full px-4 py-2.5 rounded-2xl bg-[#F8F6FC] border border-[#DDD6FE] text-sm text-[#1E1B4B] placeholder-[#94A3B8] outline-none focus:ring-2 focus:ring-[#6C5CE7] resize-none"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1E1B4B] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-2xl bg-[#F8F6FC] border border-[#DDD6FE] text-xs font-semibold text-[#1E1B4B] outline-none focus:ring-2 focus:ring-[#6C5CE7]"
              >
                <option value="Project">Project</option>
                <option value="GitHub">GitHub</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Study">Study</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E1B4B] mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-2xl bg-[#F8F6FC] border border-[#DDD6FE] text-xs font-semibold text-[#1E1B4B] outline-none focus:ring-2 focus:ring-[#6C5CE7]"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Timeframe & Due Date Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1E1B4B] mb-1">
                Timeframe
              </label>
              <select
                value={timeframe}
                onChange={(e) => {
                  const tf = e.target.value as any;
                  setTimeframe(tf);
                  if (tf === "today") setDueDate("Today");
                  else if (tf === "this-week") setDueDate("This Week");
                  else setDueDate("Later");
                }}
                className="w-full px-3 py-2.5 rounded-2xl bg-[#F8F6FC] border border-[#DDD6FE] text-xs font-semibold text-[#1E1B4B] outline-none focus:ring-2 focus:ring-[#6C5CE7]"
              >
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="later">Later</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E1B4B] mb-1">
                Due Date Label
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="e.g. Today, Nov 15"
                className="w-full px-3 py-2.5 rounded-2xl bg-[#F8F6FC] border border-[#DDD6FE] text-xs font-semibold text-[#1E1B4B] outline-none focus:ring-2 focus:ring-[#6C5CE7]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl text-xs font-semibold text-[#7C7F96] hover:bg-[#F3F0FF] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-[#6C5CE7] hover:bg-[#5B46D9] active:bg-[#4E38C4] text-white font-bold text-xs shadow-md shadow-[#6C5CE7]/30 transition-all"
            >
              {initialTask ? "Save Changes" : "Create Loop"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
