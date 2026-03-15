import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import pickle
import mysql.connector

def load_data_from_mysql():
    """
    Simulates loading data from MySQL.
    In a real scenario, replace with actual connection details.
    """
    # db = mysql.connector.connect(
    #     host="localhost",
    #     user="root",
    #     password="password",
    #     database="agriculture"
    # )
    # query = "SELECT * FROM crop_yield_data"
    # df = pd.read_sql(query, db)
    
    # For demonstration, we'll create a dummy dataframe
    data = {
        'State_Name': ['Maharashtra', 'Punjab', 'Karnataka', 'Tamil Nadu'] * 250,
        'Crop': ['Rice', 'Wheat', 'Maize', 'Sugarcane'] * 250,
        'Season': ['Kharif', 'Rabi', 'Kharif', 'Whole Year'] * 250,
        'Temperature': np.random.randint(15, 35, 1000),
        'Rainfall': np.random.randint(200, 2000, 1000),
        'Area': np.random.randint(100, 5000, 1000),
        'Production': np.random.randint(500, 10000, 1000)
    }
    df = pd.DataFrame(data)
    df['Yield'] = df['Production'] / df['Area']
    return df

def preprocess_data(df):
    # Handle missing values
    df = df.dropna()
    
    # Encode categorical variables
    df = pd.get_dummies(df, columns=['State_Name', 'Crop', 'Season'])
    
    # Split features and target
    X = df.drop(['Production', 'Yield'], axis=1)
    y = df['Yield']
    
    return train_test_split(X, y, test_size=0.2, random_state=42)

def train_and_evaluate():
    df = load_data_from_mysql()
    X_train, X_test, y_train, y_test = preprocess_data(df)
    
    models = {
        "Linear Regression": LinearRegression(),
        "Decision Tree": DecisionTreeRegressor(),
        "Random Forest": RandomForestRegressor(n_estimators=100),
        "Gradient Boosting": GradientBoostingRegressor()
    }
    
    best_model = None
    best_score = -float('inf')
    
    for name, model in models.items():
        model.fit(X_train, y_train)
        predictions = model.predict(X_test)
        r2 = r2_score(y_test, predictions)
        mae = mean_absolute_error(y_test, predictions)
        rmse = np.sqrt(mean_squared_error(y_test, predictions))
        
        print(f"{name} - R2: {r2:.4f}, MAE: {mae:.4f}, RMSE: {rmse:.4f}")
        
        if r2 > best_score:
            best_score = r2
            best_model = model
            best_model_name = name
            
    print(f"\nBest Model: {best_model_name} with R2: {best_score:.4f}")
    
    # Save the best model
    with open('model/crop_yield_model.pkl', 'wb') as f:
        pickle.dump(best_model, f)
        
    # Save feature columns for reference in prediction API
    with open('model/features.pkl', 'wb') as f:
        pickle.dump(X_train.columns.tolist(), f)

if __name__ == "__main__":
    train_and_evaluate()
