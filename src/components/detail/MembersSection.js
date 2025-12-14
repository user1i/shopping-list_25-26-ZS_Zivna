import React from "react";

export default function MembersSection({
  members,
  isOwner,
  onAddMember,
  onRemoveMember,
  onLeave,
}) {
  return (
    <div className="detail-column detail-members">
      <div className="detail-section-header">
        <div className="detail-section-title">
          Members (Owner + invited users)
          {isOwner && (
            <button
              type="button"
              className="primary-button inline-add-button"
              onClick={onAddMember}
            >
              + Add member
            </button>
          )}
        </div>
      </div>

      <ul className="detail-members-list">
        {members.map((member) => (
          <li key={member.id} className="detail-member-row">
            <span className="detail-member-text">
              {member.name} ({member.role})
            </span>

            {isOwner && member.role !== "Owner" && (
              <button
                type="button"
                className="text-button"
                onClick={() => onRemoveMember(member.id)}
              >
                [Remove]
              </button>
            )}

            {!isOwner && member.isCurrentUser && (
              <button type="button" className="text-button" onClick={onLeave}>
                [Leave]
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
