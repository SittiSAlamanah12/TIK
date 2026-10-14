/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GradeLevel, UserRole, NotificationItem, Submission, Assignment } from './types';
import {
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_NOTIFICATIONS,
  CURRENT_STUDENT,
  TEACHER_PROFILE
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CurriculumViewer } from './components/CurriculumViewer';
import { NetworkSimulator } from './components/NetworkSimulator';
import { QuizSection } from './components/QuizSection';
import { AssignmentManager } from './components/AssignmentManager';
import { LeaderboardSection } from './components/LeaderboardSection';
import { CommunityHub } from './components/CommunityHub';
import { Footer } from './components/Footer';
import { NotificationDrawer } from './components/NotificationDrawer';
import { sound } from './utils/sound';

export default function App() {
  // App State
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('11');
  const [userRole, setUserRole] = useState<UserRole>('siswa');
  const [activeSection, setActiveSection] = useState<string>('materi');

  // Gamification State
  const [userXp, setUserXp] = useState<number>(CURRENT_STUDENT.xp);

  // LMS & Submissions State
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);

  // Real-time Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  // Toggle role between Siswa & Guru
  const handleToggleRole = () => {
    setUserRole((prev) => (prev === 'siswa' ? 'guru' : 'siswa'));
    sound.playNotificationChime();
  };

  // Navigation handler
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Add XP
  const handleAddXp = (amount: number) => {
    setUserXp((prev) => prev + amount);
  };

  // Trigger new notification
  const handleTriggerNotification = (item: NotificationItem) => {
    setNotifications((prev) => [item, ...prev]);
    sound.playNotificationChime();
  };

  // Add student submission
  const handleAddSubmission = (submission: Submission) => {
    setSubmissions((prev) => [submission, ...prev]);
  };

  // Grade student submission
  const handleGradeSubmission = (submissionId: string, score: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId
          ? {
              ...sub,
              status: 'graded',
              score,
              feedback,
              gradedAt: new Date().toLocaleString('id-ID'),
            }
          : sub
      )
    );
  };

  // Add new assignment
  const handleAddNewAssignment = (assignment: Assignment) => {
    setAssignments((prev) => [assignment, ...prev]);
  };

  // Mark all notifications as read
  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Quick simulate new submission
  const handleSimulateNewSubmission = () => {
    const studentNames = ['Rizky Firmansyah', 'Adinda Putri', 'Zaki Ramadhan', 'Maya Safitri'];
    const randomName = studentNames[Math.floor(Math.random() * studentNames.length)];
    const task = assignments.find((a) => a.grade === selectedGrade) || assignments[0];

    const newSub: Submission = {
      id: `sub_sim_${Date.now()}`,
      assignmentId: task.id,
      studentId: `usr_sim_${Date.now()}`,
      studentName: randomName,
      studentGrade: selectedGrade,
      submittedAt: new Date().toLocaleString('id-ID'),
      fileOrUrl: 'https://github.com/siswa-sma/lab-network-simulation',
      notes: 'Tugas telah selesai dikerjakan sesuai spesifikasi lab.',
      status: 'pending',
    };

    setSubmissions((prev) => [newSub, ...prev]);

    handleTriggerNotification({
      id: `notif_${Date.now()}`,
      title: 'Pengumpulan Tugas Baru Masuk',
      message: `${randomName} (Kelas ${selectedGrade}) baru saja mengumpulkan tugas "${task.title}".`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      type: 'submission',
      read: false,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Bar Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        userRole={userRole}
        onToggleRole={handleToggleRole}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        unreadCount={unreadNotificationCount}
        userXp={userXp}
      />

      {/* Main Learning Hub Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          selectedGrade={selectedGrade}
          onSelectGrade={setSelectedGrade}
          onNavigate={handleNavigate}
        />

        {/* 3D Visual Concepts & Video Lessons */}
        <CurriculumViewer
          selectedGrade={selectedGrade}
          onSelectGrade={setSelectedGrade}
          onNavigateToQuiz={() => handleNavigate('kuis')}
        />

        {/* Interactive Network Simulator (Packet Tracer Web) */}
        <NetworkSimulator />

        {/* Interactive Quiz Engine */}
        <QuizSection
          selectedGrade={selectedGrade}
          onSelectGrade={setSelectedGrade}
          onAddXp={handleAddXp}
        />

        {/* Assignment & Grading Management System (Real-time LMS) */}
        <AssignmentManager
          userRole={userRole}
          selectedGrade={selectedGrade}
          onSelectGrade={setSelectedGrade}
          assignments={assignments}
          submissions={submissions}
          onAddSubmission={handleAddSubmission}
          onGradeSubmission={handleGradeSubmission}
          onTriggerNotification={handleTriggerNotification}
          onAddNewAssignment={handleAddNewAssignment}
        />

        {/* Gamification & Leaderboard */}
        <LeaderboardSection
          selectedGrade={selectedGrade}
          onSelectGrade={setSelectedGrade}
          currentUserXp={userXp}
        />

        {/* Discussions & Interactive Live Chat */}
        <CommunityHub
          userRole={userRole}
          selectedGrade={selectedGrade}
          onSelectGrade={setSelectedGrade}
        />
      </main>

      {/* Real-time Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onSimulateNewSubmission={handleSimulateNewSubmission}
      />

      {/* Footer with mandatory copyright belajarBarengSitty */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
