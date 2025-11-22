import React from "react";
import { Globe, FileText, Calendar, Users } from "lucide-react";

// Types
interface Member {
  name: string;
  nim: string;
}

// Dummy Data
const websiteUrl = "www.andalora.com";
const description =
  "Dibuat sebagai tugas mata kuliah Organisasi Komputer II pada semester 5, Jurusan Teknik Komputer, Fakultas Teknologi Informasi, Universitas Andalas.";
const year = "2025";
const groupNumber = "Kelompok 5";

const members: Member[] = [
  { name: "Shaza Zulfiani", nim: "2311511018" },
  { name: "Rahmat Fajar Saputra", nim: "2311512036" },
  { name: "Aditya Khiswanda", nim: "2311513012" },
  { name: "Asyiatul Mufidah Andini", nim: "2311512010" },
  { name: "Athallah Fajri", nim: "2311511008" },
  { name: "Muhammad Reyhan Ramadhan", nim: "2211513052" },
];

// Footer Component
export function Footer() {
  return (
    <footer className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 w-full">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Tentang Kami
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Website Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg">
                  <Globe className="w-6 h-6 text-gray-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Website</h3>
                  <div className="text-gray-600 text-sm leading-relaxed">
                    <a
                      href={`https://${websiteUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {websiteUrl}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg">
                  <FileText className="w-6 h-6 text-gray-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Deskripsi
                  </h3>
                  <div className="text-gray-600 text-sm leading-relaxed">
                    {description}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Members Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg">
                  <Users className="w-6 h-6 text-gray-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {groupNumber}
                  </h3>
                  <div className="space-y-2">
                    {members.map((member, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 font-medium">{member.name}</span>
                          <span className="text-gray-500">{member.nim}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-gray-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Sejak</h3>
                  <p className="text-gray-600 text-sm">{year}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
