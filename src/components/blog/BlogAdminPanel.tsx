import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, User, CheckCircle, Tag, ShieldCheck, X } from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { BlogUser } from '../../services/authService';

interface BlogAdminPanelProps {
  onClose: () => void;
}

export function BlogAdminPanel({ onClose }: BlogAdminPanelProps) {
  const [users, setUsers] = useState<BlogUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'blog_users'));
        const data = querySnapshot.docs.map(doc => doc.data() as BlogUser);
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      await updateDoc(doc(db, 'blog_users', userId), { role });
      setUsers(users.map(u => u.uid === userId ? { ...u, role } as BlogUser : u));
    } catch (err) {
      console.error('Error updating role:', err);
      alert('Sem permissão para alterar cargos.');
    }
  };

  const handleToggleVerified = async (userId: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'blog_users', userId), { isVerified: !current });
      setUsers(users.map(u => u.uid === userId ? { ...u, isVerified: !current } as BlogUser : u));
    } catch (err) {
      console.error('Error updating verification:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a070e]/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-900 border border-white/10 w-full max-w-4xl p-8 rounded-none shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Shield className="text-primary w-6 h-6" />
            <h2 className="text-2xl font-black italic">GERENCIAR <span className="text-primary italic">USUÁRIOS</span></h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto grow">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                <th className="pb-4 pt-2">Usuário</th>
                <th className="pb-4 pt-2">Cargo Atual</th>
                <th className="pb-4 pt-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.uid} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                        {u.fullName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold flex items-center gap-2">
                          {u.fullName} 
                          {u.isVerified && <CheckCircle className="w-3 h-3 text-sky-400" />}
                        </p>
                        <p className="text-[10px] text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 border ${
                      u.role === 'admin' ? 'border-primary text-primary' : 
                      u.role === 'staff' ? 'border-sky-400 text-sky-400' : 
                      u.role === 'client' ? 'border-emerald-400 text-emerald-400' : 
                      'border-white/20 text-gray-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleUpdateRole(u.uid, 'staff')}
                        className="p-2 border border-white/10 hover:border-sky-400 text-gray-500 hover:text-sky-400 transition-all"
                        title="Promover a Staff"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleUpdateRole(u.uid, 'client')}
                        className="p-2 border border-white/10 hover:border-emerald-400 text-gray-500 hover:text-emerald-400 transition-all"
                        title="Promover a Cliente"
                      >
                        <Tag className="w-4 h-4" />
                      </button>
                      <button 
                         onClick={() => handleToggleVerified(u.uid, u.isVerified)}
                        className="p-2 border border-white/10 hover:border-primary text-gray-500 hover:text-primary transition-all"
                        title="Alternar Verificado"
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
