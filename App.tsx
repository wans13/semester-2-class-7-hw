import { useEffect, useState } from "react";
import { supabase, Database } from "./supabase";

type Student = Database["public"]["Tables"]["students"]["Row"];
type School = Database["public"]["Tables"]["school"]["Row"];
function App() {
  //useStates
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [school, setSchool] = useState("");
  const [newSchool, setNewSchool] = useState("");
  const [address, setAddress] = useState("");
  const [foundYear, setFoundYear] = useState("");

  //backend fetch
  const fetchStudents = async () => {
    const response = await supabase.from("students").select("*");
    if (response.data) {
      setStudents(response.data);
    }
  };
  const fetchSchools = async () => {
    const response = await supabase.from("school").select("*");
    if (response.data) {
      setSchools(response.data);
    }
  };
  useEffect(() => {
    fetchStudents();
  }, []);
  useEffect(() => {
    fetchSchools();
  }, []);

  //functions
  const handleDelete = async (id: Student["id"]) => {
    await supabase.from("students").delete().eq("id", id);
    await fetchStudents();
  };
  const createStudent = async () => {
    if (school == "Select School") return;
    await supabase.from("students").insert({
      firstName: firstName,
      lastName: lastName,
      dob: dob,
      school: school,
    });
    await fetchStudents();
    setFirstName("");
    setLastName("");
    setDob("");
    setSchool("");
  };
  const createSchool = async () => {
    await supabase.from("school").insert({
      title: newSchool,
      address: address,
      foundedIn: foundYear,
    });
    await fetchSchools();
    setNewSchool("");
    setAddress("");
    setFoundYear("");
  };
  const schoolNotEmpty = (id: School["id"]) => {
    for (let i = 0; i < students.length; i++) {
      if (students[i].school == id) {
        return true;
      }
    }
  };
  const deleteSchool = async (id: School["id"]) => {
    if (schoolNotEmpty(id)) {
      return;
    }
    await supabase.from("school").delete().eq("id", id);
    await fetchSchools();
  };
  const getStudentCount = (school: School) => {
    let n = 0;
    for (let i = 0; i < students.length; i++) {
      if (students[i].school == school.id) {
        n++;
      }
    }
    return n;
  };
  return (
    <>
      <div>
        Add school:{" "}
        <input
          type="text"
          placeholder="School Name"
          onChange={(e) => setNewSchool(e.target.value)}
          value={newSchool}
        />
        <input
          type="text"
          placeholder="Address"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
        />
        <input
          type="number"
          placeholder="Year of Establishment"
          onChange={(e) => setFoundYear(e.target.value)}
          value={foundYear}
        />
        <button onClick={() => createSchool()}>Create School</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="First Name"
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
          value={firstName}
        />
        <input
          type="text"
          placeholder="Last Name"
          onChange={(e) => {
            setLastName(e.target.value);
          }}
          value={lastName}
        />
        <input
          type="date"
          placeholder="Date of Birth"
          onChange={(e) => {
            setDob(e.target.value);
          }}
          value={dob}
        />
        <select
          onChange={(e) => {
            setSchool(e.target.value);
          }}
          value={school}
        >
          <option value="1" key={0}>
            Select School
          </option>
          {schools.map((v) => {
            return (
              <option value={v.id} key={v.id}>
                {v.title}
              </option>
            );
          })}
        </select>
        <button onClick={createStudent}>Create student</button>
      </div>

      <h1>Students</h1>
      {students.map((v, i) => {
        return (
          <div key={i}>
            <p>
              {v.firstName} {v.lastName} {v.dob}{" "}
              <button onClick={() => handleDelete(v.id)}>Delete</button>
            </p>
          </div>
        );
      })}

      <h1>Schools</h1>
      {schools.map((v) => {
        return (
          <div key={v.id}>
            <p>
              <b>{v.title}</b>
              <br />
              Located at {v.address}. <br /> Established in {v.foundedIn}.{" "}
              <br />
              {getStudentCount(v)}{" "}
              {getStudentCount(v) == 1 ? "student" : "students"} enrolled.
            </p>
            <button onClick={() => deleteSchool(v.id)}>
              {schoolNotEmpty(v.id)
                ? "Cant delete school with students"
                : "Delete school"}
            </button>
          </div>
        );
      })}
    </>
  );
}

export default App;
