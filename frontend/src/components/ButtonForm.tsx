type ButtonFormProps = {
	creating: boolean;
	onClick: () => void;
}

export default function ButtonForm({ creating, onClick }: ButtonFormProps) {
  return (
    <div>
        <button disabled={creating} className="btn-primary w-full" >
          {creating ? "Creating..." : "Create"}
        </button>
				</div>
  )
}