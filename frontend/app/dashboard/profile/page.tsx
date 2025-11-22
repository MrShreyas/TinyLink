"use client"

import type React from "react"

import { useState } from "react"
import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [updateSuccess, setUpdateSuccess] = useState("")
  const [updateError, setUpdateError] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      setFormData({
        firstName: parsedUser.firstName || "",
        lastName: parsedUser.lastName || "",
        email: parsedUser.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }
  }, [])

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setUpdateError("")
    setUpdateSuccess("")

    if (!formData.firstName || !formData.lastName) {
      setUpdateError("Please fill in all fields")
      return
    }

    // Simulate update
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`,
      }),
    )
    setUpdateSuccess("Profile updated successfully!")
    setTimeout(() => setUpdateSuccess(""), 3000)
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    setUpdateError("")
    setUpdateSuccess("")

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setUpdateError("Please fill in all password fields")
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setUpdateError("New passwords do not match")
      return
    }

    if (formData.newPassword.length < 8) {
      setUpdateError("Password must be at least 8 characters")
      return
    }

    // Simulate update
    setUpdateSuccess("Password changed successfully!")
    setFormData({
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setTimeout(() => setUpdateSuccess(""), 3000)
  }

  if (!user) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-foreground/70">Manage your account information</p>
      </div>

      {updateSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{updateSuccess}</div>
      )}

      {updateError && (
        <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg">{updateError}</div>
      )}

      <Card className="p-6 max-w-2xl">
        <h2 className="text-xl font-semibold text-foreground mb-6">Personal Information</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">First Name</label>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Last Name</label>
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input type="email" value={formData.email} disabled />
            <p className="text-xs text-foreground/60">Email cannot be changed</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white">Update Profile</Button>
        </form>
      </Card>

      <Card className="p-6 max-w-2xl">
        <h2 className="text-xl font-semibold text-foreground mb-6">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Current Password</label>
            <Input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">New Password</label>
            <Input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Confirm Password</label>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white">Change Password</Button>
        </form>
      </Card>
    </div>
  )
}
