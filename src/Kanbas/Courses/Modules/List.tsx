import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  addModule,
  deleteModule,
  updateModule,
  setModule,
  setModules,
} from "./reducer";

import * as client from "./client";

import { KanbasState } from "../../store";

import { findModulesForCourse, createModule } from "./client";


function ModuleList() {



  const { courseId } = useParams();

  useEffect(() => {
    findModulesForCourse(courseId)
      .then((modules) =>
        dispatch(setModules(modules))
    );
  }, [courseId]);




  const moduleList = useSelector((state: KanbasState) => 
    state.modulesReducer.modules);
  const module = useSelector((state: KanbasState) => 
    state.modulesReducer.module);
  const dispatch = useDispatch();

  const handleAddModule = () => {
    createModule(courseId, module).then((module) => {
      dispatch(addModule(module));
    });
  };

  const handleDeleteModule = (moduleId: string) => {
    client.deleteModule(moduleId).then((status) => {
      dispatch(deleteModule(moduleId));
    });
  };

  const handleUpdateModule = async () => {
    const status = await client.updateModule(module);
    dispatch(updateModule(module));
  };

  return (
    <ul className="list-group">
      <li className="list-group-item">
        
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}> {/* Added flex container */}
          <button onClick={handleAddModule}>
            Add
          </button>
          <button onClick={handleUpdateModule}>
            Update
          </button>
          <input
            value={module.name}
            className="form-control" 
            onChange={(e) => dispatch(setModule({ ...module, name: e.target.value }))}
            style={{ flex: '1' }} 
          />
          <textarea
            value={module.description}
            className="form-control" 
            style={{ height: '38px', flex: '1' }} 
            onChange={(e) => dispatch(setModule({ ...module, description: e.target.value }))}
          />
        </div>


      </li>
      {moduleList
        .filter((module) => module.course === courseId)
        .map((module, index) => (
          <li key={index} className="list-group-item">
            <h3>{module.name}</h3>
            <p>{module.description}</p>
            <button
              onClick={() => dispatch(setModule(module))}>
              Edit
            </button>
            <button
              onClick={() => handleDeleteModule(module._id)}>
              Delete
            </button>
          </li>
        ))}
    </ul>
  );
}
export default ModuleList;